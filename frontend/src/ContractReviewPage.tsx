


export default function ContractReviewPage(){

    async function handleClickUploadContract(){
        const file = document.getElementById('file-input').files[0]
        console.log(file)

        const formData = new FormData();
        formData.append("file", file);
    
        try {
        const response = await axios.post(`${API_URL}/analyze-contract`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        console.log('response da API: ', response.data);
        } catch (error) {
        console.error("Erro ao enviar contrato:", error);
        }
    }


    return(
        <div className="">
            <h1>Pagina de analisar contrato</h1>

            <div className="flex flex-col">
                <p onClick={handleClickUploadContract} className="p-4 bg-gray-800 self-start hover:cursor-pointer">TestUpload Contract</p>
                <input type="file" name="" id="file-input" />
            </div>
        </div>
    )
}