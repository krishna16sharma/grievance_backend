const handleWebTraffic = (req,res,db) =>{

    (db.select('*').from('website_traffic'))
        .then(wt=>{
            res.json(wt);
        })

}
module.exports ={
    handleWebTraffic: handleWebTraffic
}
