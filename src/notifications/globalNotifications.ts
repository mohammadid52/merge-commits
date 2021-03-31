export const globalNotifications = {
  dashboard:{},
  profile:{
    info:{},
    alert:{
      avatar_unset:{
        message: 'Please set up your avatar to complete your profile!',
        linkFunction: () => console.log('Please setup avatar!'),
      }
    },
    error:{}
  },
  classroom:{},
  lessonPlanner:{},
  userManagement:{},
  instituteManagement:{}
}