export interface UserFromJwt {
  id: string;
  email: string;
  username: string;
  name: string;
  roles: { [key: string]: boolean };
}
