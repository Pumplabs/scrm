export const handleUsersParams = (users, valueKey = 'extId') => {
  let depIds = []
  let userIds = []
  // 如果选了成员
  if (Array.isArray(users)) {
    users.forEach((ele) => {
      if (ele.isDep) {
        depIds = [...depIds, ele[valueKey]]
      } else {
        userIds = [...userIds, ele[valueKey]]
      }
    })
  }
  return {
    depIds,
    userIds,
  }
}

export const refillUsers = (data = {}) => {
  const { userArr = [], depArr = [], key = 'id' } = data
  let res = []
  if (Array.isArray(userArr)) {
    userArr.forEach((ele) => {
      res = [
        ...res,
        {
          isUser: true,
          key: `user_${ele[key]}`,
          ...ele,
        },
      ]
    })
  }
  if (Array.isArray(depArr)) {
    depArr.forEach((ele) => {
      res = [
        ...res,
        {
          isDep: true,
          key: `dep_${ele[key]}`,
          ...ele,
        },
      ]
    })
  }
  return res
}
