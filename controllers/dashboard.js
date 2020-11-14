const handleDashboard = (req,res,db) =>{
    const {user} =req.body;
    db.select('user_id').from('users')
    .where('person_id','=',user.person_id)
    .then(
        u_id =>{
            console.log("User id",u_id[0]);
            db.select('*').from('grievance')
            .where('user_id','=',u_id[0].user_id)
            .then(
                details =>{
                    console.log('Retrieved!', details, details[0])
                    res.json(details)
                }
            )
        }
    )

}

module.exports ={
    handleDashboard: handleDashboard
}
