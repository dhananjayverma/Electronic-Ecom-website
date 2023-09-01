import axios from "axios";

export const getSubCategories = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subCategories`);

export const getSubCategory = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/subCategory/${slug}`);

export const removeSubCategory = async (slug,authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/subCategory/${slug}`,{
      headers:{
          authtoken
      }
  });
  
export const updateSubCategory = async (slug,subCategory,authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/subCategory/${slug}`,subCategory,{
      headers:{
          authtoken
      }
  });
  
export const createSubCategory = async (subCategory,authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/subCategory`,subCategory,{
      headers:{
          authtoken
      }
  });
 

 
