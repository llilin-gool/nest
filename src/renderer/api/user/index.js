import request  from "../../utils/axios"

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

//学生查询自己上的所有课程
export function getCourse() {
  return request({
    url: "/stu/course",
    method: "GET",
  });
}

//学生查询自己正在上的课
export function getOpeningClasswork() {
  return request({
    url: "/stu/course/openingClasswork",
    method: "GET",
  });
}

//按照条件获取课程作业
export function getHomeworks(data) {
  return request({
    url: "/stu/homework/filter",
    method: "POST",
    data
  });
}

//获取作业详情
export function getHomeworkInfo(homework_id) {
  return request({
    url: `/stu/homework/${homework_id}`,
    method: "GET",
  });
}

//提交作业
export function postAnswerForQuestion(data) {
  return request({
    url: "/stu/question/answerForQuestion",
    method: "POST",
    data
  });
}

//学生作答OJ题目
export function postAnswerForOJQuestion(data) {
  return request({
    url: "/stu/question/answerForOJQuestion",
    method: "POST",
    data
  })
}

