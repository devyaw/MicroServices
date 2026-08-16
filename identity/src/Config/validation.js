import joi from 'joi';


const validatedBody = (body) => {
  const schema = joi.object({
    username: joi.string().min(4),
    email: joi.string().email().required(),
    password: joi.string().required().min(5),
  });
  return schema.validate(body);
}


export default validatedBody;
