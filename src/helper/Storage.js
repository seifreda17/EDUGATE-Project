export const setAuthUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
  };
  export const getAuthUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log("Retrieved auth user data:", userData); // Debugging line
        return {
          ...userData,
          user_id: userData.user_id, // Ensure user_id is stored correctly
        };
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        return null;
      }
    }return null;
  };
  
  
  
  export const removeAuthUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };
  