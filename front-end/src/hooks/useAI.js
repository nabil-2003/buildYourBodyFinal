import { useDispatch, useSelector } from "react-redux";
import { loadingPlan, setPlan, AiError, ProgressCheck } from "../reducers/PlanReducer";
import { useNavigate } from "react-router-dom";
import usePlan from "./usePlan";
import { setLoadingAI, setMessage } from "../reducers/chatBotReducer";
const URL = import.meta.env.VITE_API_BASE_URL;

const useAI = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.userReducer.user);
  const dispatch = useDispatch();
    const {savePlan} = usePlan()
  const sendPromt = async (prompt) => {
    try {
      const response = await fetch(`${URL}api/coach/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) {
        return { AiError: "try later" };
      }
      const data = await response.json();
      return { reply: data.reply };
    } catch (error) {
      console.error('Error connecting to AI service:', error);
    }
  };

  const SendPromtToAi = async (promt, useFor) => {
    if (useFor === "generatePlanPromt") {
     const generatePlanPromt = `
  
  {
  "prompt": "Generate a personalized fitness plan in JSON format with the following structure:",
  "requirements": {
    "planName": "String representing the name of the fitness plan",
    "workOut": [
      {
        "day{i}": "String representing the day name chosen and   the body part/training focus for day {i}",
        "exercices": [
          {
            "exerciceName": "String",
            "smallImage": "String (URL to exercise image)",
            "sets": "String describing sets and reps (e.g., '4x8-10')",
            "reset": {
              "betweenSetes": "String (rest time between sets)",
              "afterExercice": "String (rest time after exercise)"
            },
              completed : false
          }
        ],
        "nurtationNeeds": [
          {
            "calories": "Number (daily calorie target)",
            "carbs": "Number (daily carb target in grams)"
            protein: "Number (daily protein target in grams)",
            fats: "Number (daily fat target in grams)"
          }
        ]
          ,completed: false // Indicates if the day's workout is completed
          ,foodEntries:[]
      }
    ]
  },
  "examples": [
    {
      "day1": " ${promt?.workoutDays?.join("||")} Chest & Triceps",
      "exercices": [
        {
          "exerciceName": "Bench Press",
          "smallImage": "free images url",
          "sets": "4x8-10",
          "reset": {
            "betweenSetes": "60s",
            "afterExercice": "90s"
          }
            ,completed : false
        }
      ],
      "nurtationNeeds": [
        {
          "calories": 2500,
          "carbs":  300 , 
          fats : 390, 
          protein: 150
        },
        "nurtationProgress": [
        {
          "calories": 0,
          "carbs":  0 , 
          fats : 0, 
          protein: 0
        }
      ]
        ,completed: false,
        ,foodEntries:[]
    }
  ],
  "notes": [
    "Use consistent naming conventions (e.g., 'day1', 'day2')",
     ensure the match the days of training ",
    "Include 4-5 exercises per workout day",
    "Provide realistic rest periods and nutrition targets",
    "Ensure all URLs are real and accessible",
    "Maintain valid JSON syntax throughout", 
    nurtationProgress field  add it and just initial it with 0 values , 
    allways response should be  like that : json {}
  
    "data" : ${
    JSON.stringify(promt)
  } // generate plans based on this data
}
  
  `
          dispatch(loadingPlan({ loading: true }));
    const res = await   sendPromt(generatePlanPromt); 

            if (res?.AiError) {
                // dispatch error AI
            

                dispatch(AiError({ AiError: res.AiError })) ;
                dispatch(loadingPlan({ loading: false }));
            }
             else{
             // Clean up the response
            dispatch(setPlan({ plan: JSON.parse(String(res.reply).split("```")[1].split("json")[1].trim()) })); // Dispatch the plan to the store
               savePlan( JSON.parse(String(res.reply).split("```")[1].split("json")[1].trim()))
            dispatch(loadingPlan({ loading: false }));
            navigate("/myPlan");
      
             }
    } else if (useFor === "nutrationCalcPromt") {
      dispatch(loadingPlan({ loading: true }));
      const nurtationCalcPromt = 
        "calculate carbs / fats / protein / calories based on the user input and provide a JSON valid without any other text response with the calculated values. the input: '" 
        + promt.propmt + 
        "' the response should be like this don't add any text any explanation: ```json{}``` "+
        
        
       " example ``` json{ carbs : 1 ,  fats : 1 ,  protein : 1,  calories : 23} ``` ";

      const res = await sendPromt(nurtationCalcPromt);

      if (res?.AiError) {
        dispatch(AiError({ AiError: res.AiError }));
        dispatch(loadingPlan({ loading: false }));
      } else {
        const jsonResponse = JSON.parse(String(res.reply).split("```")[1].split("json")[1].trim());
        dispatch(ProgressCheck({ id: promt.id, data: { nutrationNeeds: jsonResponse } }));
        dispatch(loadingPlan({ loading: false }));
      }
    }
     else if( useFor === "chatPromt" ){

      const chatPromt = `
       you are a pro  fitness coach
       my q${JSON.stringify(promt)}
       response should be like this don't add any text any explanation: \`\`\`json{ "response" : your response }\`\`\`

       example : \`\`\`json{ "response" : hi i m your coach }\`\`\`
      `;
      dispatch(setLoadingAI({ loading: true }));
      const res = await sendPromt(chatPromt);
      if (res?.AiError) {
        dispatch(AiError({ chatError: res.AiError }));
        dispatch(setLoadingAI({ loading: false }));
      } else {
        console.log(res.reply);
        const jsonResponse = JSON.parse(String(res.reply).split("```")[1].split("json")[1].trim());
        console.log(jsonResponse);
        dispatch(setMessage({ message: jsonResponse.response }));
        dispatch(setLoadingAI({ loading: false }));
        // Assuming you want to set the response as a plan
      }
     }
  };

  return { SendPromtToAi };
};

export default useAI;
