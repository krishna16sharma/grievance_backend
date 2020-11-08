const handleAadhaar = (req,res,db) =>{
    const {email,person_id, person_name,password, username, a_no, day, month, year,door_no,street, area, city, state} = req.body;
    console.log("Backend", email,person_id, person_name,password, username, a_no, day, month, year,door_no,street, area, city, state);

    if(!(email && person_name && person_id && password && username && a_no && day && month && year && door_no && street && area && city && state)){
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
    console.log("Start transaction!", person_id, day)
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
            }).then(user => {
                console.log("Done", user)
                res.json(user[0]);
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
