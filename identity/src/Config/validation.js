import joi from 'joi';


const validatedBody = (body) => {
  const schema = joi.object({
    username: joi.string().min(4).unique(),
    email: joi.string().email().required().unique(),
    password: joi.string().required().min(5),
  });
  return schema.validate(body);
}


export default validatedBody;
