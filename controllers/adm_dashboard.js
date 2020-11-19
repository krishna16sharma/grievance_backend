const handleAdmin = (req,res,db) =>{
    const {user} =req.body;
    console.log('Admin', user)
    db.select('admin_id').from('admin')
    .where('person_id','=',user.person_id)
    .then(
        a_id =>{
            console.log("Admin id",a_id[0]);
            db.select('*').from('grievance')
            .where('admin_id','=',a_id[0].admin_id)
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
    handleAdmin: handleAdmin
}
