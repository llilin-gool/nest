import { request } from "../../utils/axios"

export function login(userLoginDto) {
  return request({
    url: "/auth/login",
    method: "post",
    data: userLoginDto
  });
}

export function getInfo() {
  return request({
    url: "/auth/user",
    method: "get",
  });
}

