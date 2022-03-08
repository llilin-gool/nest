import store from '..'
import {
  login,
  getInfo
} from '../../api/user/index'
import {
  getToken,
  setToken
} from '../../utils/auth'

const user = {
  state: {
    token: getToken(),
    user_id: "",
    nickname: "",
    username:"",
    type: "none",
    term_name: "",
    course:"",
    term_id: 0,
    college_id: 0,
    teacher_id: 0,
    office: "",
    student_id: 0,
    avatar:"",
    classroom_id: 0,
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    
      SET_USERID (state, user_id) {
      state.user_id = user_id
    },
    
      SET_NICKNAME (state, nickname) {
      state.nickname = nickname
    },
      SET_USERNAME(state, username) {
      state.username = username
    },
    
      SET_TYPE (state, type) {
      state.type = type
    },
    
      SET_TERM_ID (state, term_id) {
      state.term_id = term_id
    },
    
      SET_TERM_NAME (state, term_name) {
      state.term_name = term_name
    },
    
      SET_COLLEGEID (state, college_id) {
      state.college_id = college_id
    },
    
      SET_TEACHERID (state, teacher_id) {
      state.teacher_id = teacher_id
    },
    
      SET_OFFICE (state, office) {
      state.office = office
    },
    
      SET_STUDENTID (state, student_id) {
      state.student_id = student_id
    },
    
      SET_CLASSROOMID (state, classroom_id) {
      state.classroom_id = classroom_id
    },
    
      SET_COURSE (state, course) {
      state.course = course
    },
    
      SET_AVATAR (state, avatar) {
      state.avatar = avatar
    }
  },
  getters: {
    token(state) {
      return state.token;
    },

    userId(state) {
      return state.user_id;
    },

    nickname(state) {
      return state.nickname;
    },
    username(state) {
      return state.username;
    },

    type(state) {
      return state.type;
    },

    termId(state) {
      return state.term_id;
    },

    termName(state) {
      return state.term_name;
    },

    collegeId(state) {
      return state.college_id;
    },

    teacherId(state) {
      return state.teacher_id;
    },

    officeId(state) {
      return state.office;
    },

    studentId(state) {
      return state.student_id;
    },

    classroomId(state) {
      return state.classroom_id;
    },

    course(state) {
      return state.course;
    },

    avatar(state) {
      return state.avatar;
    },


  },
  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        login({username, password}).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve(
            store.dispatch("GetUserInfo")
          )
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo()
        .then(response => {
          const { data } = response;
          commit("SET_USERID", data.data._id);
          commit("SET_USERNAME", data.data.username);
          commit("SET_NICKNAME", data.data.nickname);
          commit("SET_COLLEGEID", data.data.college._id);
          commit("SET_TEACHERID", data.data.teacher);
          commit("SET_OFFICE", data.data.belongTo);
          commit("SET_STUDENTID", data.data.student);
          commit("SET_AVATAR", data.data.avatar);
          commit("SET_TYPE", data.data.userType);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
      })
    }
  }
}

export default user