// here we make a users class , so that we could add , remove , update , delete a user.
// we would store all the users in a class.

class Users {
  constructor () {
    this.users = []   // this in classes, refers to the instance of the class.
  }
  addUser (id, name, room) {      // a method to add User.
    let user = {id, name, room}
    this.users.push(user);
    return user
  }

  removeUser (id) {               // a method to reove the user.
    let user = this.getUser(id)       // get User is the method we will define below, to get a user.
    if(user) {
      this.users = this.users.filter((user) => user.id !== id)
      // if there is a user with the given id.
      // we filter out the all the users except the user with the id given
    }

    return user
  }

  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
    // wefilter out the user from the users array, whose id is the same as given id.
    // [0] tells the first element to be taken as filter method on array makes a new array. with the filtered elements.
    // which in our case is the user with the given id.
  }

  getUserList (room) {            // a mthod to get the users in a particular room.
    let users =  this.users.filter((user) => user.room === room);
    // we filter out the users with the same room.
    let namesArray = users.map((user) => user.name)
    // make a new array with just the names of the users, in the room.

    return namesArray;
  }
}

module.exports = {Users}
