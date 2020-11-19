const handleResponse =(req,res,db) => {
    const {grievance_id} = req.body;
    console.log(grievance_id);
    db.select('*').from('grievance')
    .where('grievance_id','=',grievance_id)
    .then(
        row=>{
            var r =row[0].response_id;
            db.select('response_body').from('response')
            .where('response_id','=',r)
            .then(
                rb=>{
                    row[0].response_body= rb[0].response_body;
                    res.json(row[0])
                }
            )
        }
    )

}
module.exports ={
    handleResponse: handleResponse
}
