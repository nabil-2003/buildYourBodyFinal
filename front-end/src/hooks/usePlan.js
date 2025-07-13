import { useSelector , useDispatch } from "react-redux";
import { AiError, isSaved, loadingPlan, setPlan } from "../reducers/PlanReducer";
import { useNavigate } from "react-router-dom";
  const URL = import.meta.env.VITE_API_BASE_URL;
const usePlan = () => {
 const { plan } = useSelector((state) => state.planReducer);
 const {user } = useSelector((state) => state.userReducer);
   const dispatch = useDispatch();
   const navigate = useNavigate()
  const fetchPlan = async (user) => {
   const id   = user?.user.id || JSON.parse(localStorage.getItem('user'))?.user.id;
   const token =   user?.token || JSON.parse(localStorage.getItem('user'))?.token
if(token && id) {

     try { 
        dispatch(loadingPlan({ loading: true }));
      const response = await fetch(`${URL}api/plans/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

          'authorization': `Bearer ${token}`
      }})
    if (!response.ok) {
        dispatch(loadingPlan({ loading: false }));
       

      }
      else {
        const data = await response.json();
        if (data.plan) {
           dispatch(setPlan({ plan: data.plan.plan  }));
           dispatch(loadingPlan({ loading: false }));
        } else {
          console.error('No plan found in response');
        }}
    
    }
      catch (error) {
        console.error('Error fetching plan:', error);
        return { error: 'Failed to fetch plan' };
      }
   }
  }
   const   savePlan = async (planData) => {
      dispatch(loadingPlan({ loading: true }));
    try {
      const response = await fetch(`${URL}api/plans`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ userId : user.id , plan: planData })
      });
      if (!response.ok) {
         dispatch(loadingPlan({ loading: false }));
        console.error('Failed to save plan:', response.statusText);
        dispatch(AiError({ error: 'Failed to save plan' })) ;
        
      } 
       const responseData = await response.json();
       dispatch(isSaved({ saved: true }));
       dispatch(loadingPlan({ loading: false }));
       setTimeout(() => {
         dispatch(isSaved({ saved: false }))
        
        }, 5000)

    }

      catch (error) {
        console.error('Error saving plan:', error);  
       } 
      }

 const archivePlan = async (user) => {
   const id   = user?.user.id || JSON.parse(localStorage.getItem('user'))?.user.id;
   const token =   user?.token || JSON.parse(localStorage.getItem('user'))?.token
if(token && id) {

     try { 
        dispatch(loadingPlan({ loading: true }));
      const response = await fetch(`${URL}api/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',

          'authorization': `Bearer ${token}`
      }})
    if (!response.ok) {
      dispatch(loadingPlan({ loading: false }));
        console.error('Failed to archive plan:', response.statusText);
      }
      else {
 dispatch(loadingPlan({ loading: false }));
      dispatch(setPlan({ plan: {} }));
       localStorage.removeItem('plan');
       setTimeout(() => {
         navigate('/plan-builder')
        }, 100)
       }
    
    }
      catch (error) {
        console.error('Error fetching plan:', error);
        return { error: 'Failed to fetch plan' };
      }
   }
  }



  return { plan, fetchPlan , savePlan , archivePlan };
}   
export default  usePlan