const register = async ({ name, email, password, role = "user" }) => {
  const userObject = {
    name,
    email,
    password,
    role,
  };

  return userObject;
};

export { register };
