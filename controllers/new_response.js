const handleNewResponse =(req,res,db) => {
    const {grievance_id, response_body, status} = req.body;
    console.log('print',grievance_id,response_body,status);

    db.select('response_id').from('response')
    .then(
        responses=>{
            var l = responses.length+1;
            var r_id = 'R'+l;
            console.log(r_id,l);
            db.insert({
                response_id: r_id,
                response_body: response_body
            })
            .into('response')
            .then(
                row=>{
                    db('grievance').where('grievance_id','=',grievance_id)
                    .update({
                        response_id: r_id,
                        status: status
                    }).returning('*')
                    .then(
                        final =>{
                            res.json(final);
                        }
                    )
                }
            )
            .catch(err => res.status(400).json('Unable to change response.'))
        }
    )
    .catch(err => res.status(400).json('Unable to change response.'))

}

module.exports ={
    handleNewResponse: handleNewResponse
}
