const handleDept = (req,res,db) =>{
    const {user} =req.body;
    console.log('Admin', user)
    db.select('department_user_id','department_id').from('department_user')
    .where('person_id','=',user.person_id)
    .then(
        d_id =>{
            console.log("D_User",d_id[0]);
            db.select('grievance_id').from('dept_handles')
            .where('department_id','=',d_id[0].department_id)
            .then(
                grievances =>{
                    console.log('Grievances', grievances, grievances[0])
                    db.select('*').from('grievance')
                    .where('grievance_id','ilike','%'+d_id[0].department_id+'%')
                    .then(details =>{
                        console.log('Retrieved!', details, details[0])
                        res.json(details)
                    })
                }
            )
        }
    )
    .catch(err => res.status(400).json('Unable to retrieve data!'))
}

module.exports ={
    handleDept: handleDept
}
