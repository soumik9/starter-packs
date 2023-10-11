import jwt, { Secret } from 'jsonwebtoken'

export default (data: any, isRemembered: boolean): String => {
  const payload = { email: data.email, role: data.role.name, _id: data._id };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET as Secret, { expiresIn: isRemembered ? '30d' : '1d' });
  return token;
};