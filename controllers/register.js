const handleRegister = (req,res,db) =>{
    const {email,name,pwd, u_name} = req.body;
    var letters = /^[A-Za-z]+$/;
    var numbers = /^[0-9]+$/;
    var letterNumber = /^[0-9a-zA-Z]+$/;
    var mail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!(email && name && pwd && u_name)){
        return res.status(400).json("Empty values not accepted")
    }
    if(!(name.trim().match(letters) && email.trim().match(mail))){
        return res.status(400).json("Incorrect form submission")
    }
    db.select('*').from('person')
    .then(
        s => {
            var l = s.length-1
            var p_id ='PRS'+(parseInt(s[l].person_id.substring(3))+1);
            console.log(p_id);
            var new_person = {};
            new_person.person_id = p_id;
            new_person.person_name = name;
            new_person.username = u_name;
            new_person.password = pwd;
            new_person.email = email;
            res.json(new_person)
        }
    )
    /*db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))*/
}

module.exports ={
    handleRegister: handleRegister
}
