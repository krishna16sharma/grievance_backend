const handleLogin =(req,res,db) => {
    var type = ''
    const {username,password} = req.body;
    if(!(username && password)){
        return res.status(400).json("Invalid Input. Please enter again")
    }
    db.select('username','password').from('person')
    .where('username', '=', username)
    .then(data =>{
        //console.log(data, data[0].password);
        if(password == data[0].password){
            return db.select('*').from('person')
            .where('username','=',username)
            .then(user =>{
                //console.log('User',user)
                db.select('*').from('admin')
                .where('person_id','=',user[0].person_id)
                .then(
                    result =>{
                        if(result[0].person_id){
                            type = 'admin'
                            //resolve(type)
                            user[0].type = type;
                            res.json(user[0])
                        }
                    }
                ).catch(
                    not =>{
                        db.select('*').from('users')
                        .where('person_id','=',user[0].person_id)
                        .then(
                            result1 =>{
                                if(result1[0].person_id){
                                    type = 'users'
                                    //resolve(type)
                                    user[0].type = type;
                                    res.json(user[0])
                                }
                            }
                        )
                        .catch(
                            not =>{
                                db.select('*').from('department_user')
                                .where('person_id','=',user[0].person_id)
                                .then(
                                    result2 =>{
                                        if(result2[0].person_id){
                                            type = 'department'
                                            //resolve(type)
                                            user[0].type = type;
                                            res.json(user[0])
                                        }
                                    }
                                )
                                .catch(
                                    state =>{
                                        db.select('*').from('state_government_user')
                                        .where('person_id','=',user[0].person_id)
                                        .then(
                                            result2 =>{
                                                if(result2[0].person_id){
                                                    type = 'department'
                                                    //resolve(type)
                                                    user[0].type = type;
                                                    res.json(user[0])
                                                }
                                            }
                                        )
                                        .catch(
                                            ut =>{
                                                db.select('*').from('union_territory_user')
                                                .where('person_id','=',user[0].person_id)
                                                .then(
                                                    result2 =>{
                                                        if(result2[0].person_id){
                                                            type = 'department'
                                                            //resolve(type)
                                                            user[0].type = type;
                                                            res.json(user[0])
                                                        }
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                )
                console.log(user, type)
            })
            .catch(err => res.status(400).json('Unable to get user'))
        } else{
            res.status(400).json('Wrong credentials')
        }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
    handleLogin: handleLogin
}
