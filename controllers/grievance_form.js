const handleGrievance =(req,res,db) => {
    var {g_id, year, month, day, g_body, g_type, a_id, p_id} = req.body;
    //console.log(req.body);
    var ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
    var act="Submitted grievance";
    var n=0;
    let logid='L';

    db.select('response_id').from('grievance_priority')
    .where('grievance_type', '=',g_type)
    .then(
        data =>{
            var r_id = data[0].response_id;
            db.select('user_id').from('users').where('person_id', '=',p_id)
            .then(
                data =>{
                    var u_id = data[0].user_id;
                    db.select('grievance_id').from('grievance')
                    .then(
                        entries =>{
                            var l = entries.length-1;
                            g_id = g_id+l;
                            db.transaction(
                                trx =>{
                                    trx.insert({
                                        grievance_id: g_id,
                                        status: 'pending',
                                        year: year,
                                        month: month,
                                        day: day,
                                        grievance_body: g_body,
                                        grievance_type: g_type,
                                        response_id: r_id,
                                        admin_id: a_id,
                                        user_id: u_id
                                    }).into('grievance')
                                    .returning('grievance_id')
                                    .then(
                                        grievance_id=>{
                                            var concerned_body = grievance_id[0].substring(2,4);
                                            if(concerned_body == 'DP'){
                                                var department = grievance_id[0].substring(2,5);
                                                return trx('dept_handles')
                                                .returning('*')
                                                .insert({
                                                    grievance_id: g_id,
                                                    department_id: department
                                                }).then(id => {
                                                    db('website_traffic').count('log_id').then(x=>{
                                                        n=parseInt(x[0].count)+1;

                                                        logid='L'+n
                                                        //console.log(logid, n);
                                                        function getFormattedDate() {
                                                            var date = new Date();
                                                            var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                                                            return str;
                                                        }
                                                        db.insert({
                                                            log_id: logid,
                                                            ip: ip,
                                                            activity:act,
                                                            user_id:u_id,
                                                            timestamp:getFormattedDate()
                                                        })
                                                        .into('website_traffic')
                                                        .returning('log_id')
                                                        .then(db.select('*').from('website_traffic'))
                                                        .then(wt=>{res.json(id[0]);})
                                                    });

                                                })
                                            }
                                            else if(concerned_body == 'ST'){
                                                var abbreviation = grievance_id[0].substring(4,6);
                                                return trx('state_handles')
                                                .returning('*')
                                                .insert({
                                                    grievance_id: g_id,
                                                    state_abbreviation: abbreviation
                                                }).then(
                                                    state_id => {
                                                        db('website_traffic').count('log_id').then(x=>{
                                                            n=parseInt(x[0].count)+1;

                                                            logid='L'+n
                                                            //console.log(logid, n);
                                                            function getFormattedDate() {
                                                                var date = new Date();
                                                                var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                                                                return str;
                                                            }
                                                            db.insert({
                                                                log_id: logid,
                                                                ip: ip,
                                                                activity:act,
                                                                user_id:u_id,
                                                                timestamp:getFormattedDate()
                                                            })
                                                            .into('website_traffic')
                                                            .returning('log_id')
                                                            .then(db.select('*').from('website_traffic'))
                                                            .then(wt=>{res.json(state_id[0]);})
                                                        });

                                                    })
                                            }
                                            else{
                                                var abbreviation = grievance_id[0].substring(4,6);
                                                return trx('ut_handles')
                                                .returning('*')
                                                .insert({
                                                    grievance_id: g_id,
                                                    ut_abbreviation: abbreviation
                                                }).then(ut_id => {
                                                    db('website_traffic').count('log_id').then(x=>{
                                                        n=parseInt(x[0].count)+1;

                                                        logid='L'+n
                                                        //console.log(logid, n);
                                                        function getFormattedDate() {
                                                            var date = new Date();
                                                            var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                                                            return str;
                                                        }
                                                        db.insert({
                                                            log_id: logid,
                                                            ip: ip,
                                                            activity:act,
                                                            user_id:u_id,
                                                            timestamp:getFormattedDate()
                                                        })
                                                        .into('website_traffic')
                                                        .returning('log_id')
                                                        .then(db.select('*').from('website_traffic'))
                                                        .then(wt=>{res.json(ut_id[0]);})
                                                    });

                                                })
                                            }
                                        }
                                    )
                                    .then(trx.commit)
                                    .catch(trx.rollback)
                                }
                            )
                            .catch(err => res.status(400).json('Unable to submit!'))
                        }
                    )
                }
            )
        }
    )
}

module.exports = {
    handleGrievance: handleGrievance
}
