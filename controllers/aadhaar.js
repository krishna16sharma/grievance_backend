const handleAadhaar = (req,res,db) =>{
    const {email,person_id, person_name,password, person_ph_number, ph2,username, a_no, day, month, year,door_no,street, area, city, state} = req.body;
    console.log("Backend", email,person_id,person_name,password, person_ph_number,ph2,username, a_no, day, month, year,door_no,street, area, city, state);

    if(!(email && person_name && person_id && password && person_ph_number && username && a_no && day && month && year && door_no && street && area && city && state)){
        return res.status(400).json("Empty values not accepted")
    }
    /*db.select('*').from('person')
    .then(
        s => {
            var l = s.length-1
            var p_id ='PRS'+(parseInt(s[l].person_id.substring(3))+1);
            console.log(p_id);
            var new_person = {};
            new_person.person_id = p_id;
            new_person.person_name = name;
            new_person.username = username;
            new_person.password = pwd;
            new_person.email = email;
            res.json(new_person)
        }
    )*/
    console.log("Start transaction!", person_id, day, ph2=='')
    db.transaction(trx =>{
        trx.insert({
            aadhar_no: a_no,
            year: year,
            month: month,
            day: day,
            door_no: door_no,
            street: street,
            area: area,
            city: city,
            state: state
        })
        .into('aadhar_card')
        .returning('aadhar_no')
        .then(aadhaar =>{
            console.log("Halfway", aadhaar)
            return trx('person')
            .returning('*')
            .insert({
                person_id: person_id,
                person_name: person_name,
                username: username,
                password: password,
                email: email,
                aadhar_no: a_no
            }).then(ph_number => {
                if(ph2 ==''){
                    trx.insert({
                        person_id: person_id,
                        person_ph_number: person_ph_number
                    })
                    .into('ph_number')
                    .returning('*')
                    .then(user =>{
                        db.select('*').from('users')
                        .then(
                            u=>{
                                var l = u.length-1
                                var u_id ='US0'+(parseInt(u[l].user_id.substring(2))+1);
                                console.log(u_id);
                                db.insert({
                                    user_id: u_id,
                                    person_id: person_id
                                })
                                .into('users')
                                .returning('*')
                                .then(
                                    users =>{
                                        console.log("Done", users)
                                        res.json(users[0]);
                                    }
                                )
                            }
                        )
                    })
                }
                else{
                    db.insert({
                        person_id: person_id,
                        person_ph_number: person_ph_number
                    })
                    .into('ph_number')
                    .returning('person_id')
                    .then(person =>{
                        db.insert({
                            person_id: person_id,
                            person_ph_number: ph2
                        })
                        .into('ph_number')
                        .returning('*')
                        .then(
                            ph2 =>{
                                db.select('*').from('users')
                                .then(
                                    u=>{
                                        var l = u.length-1
                                        var u_id ='US0'+(parseInt(u[l].user_id.substring(2))+1);
                                        console.log(u_id);
                                        db.insert({
                                            user_id: u_id,
                                            person_id: person_id
                                        })
                                        .into('users')
                                        .returning('*')
                                        .then(
                                            users =>{
                                                console.log("Done", users)
                                                res.json(users[0]);
                                            }
                                        )
                                    }
                                )

                            }
                        )
                    }

                    )

                }

            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err =>{console.log(err); res.status(400).json('Unable to register')})
}

module.exports ={
    handleAadhaar: handleAadhaar
}
