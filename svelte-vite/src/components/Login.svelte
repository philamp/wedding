<script>
import { connectionStatus, connectionAttempted, formValuesRoot, loadingRoot } from '/src/store.js';


// pass the QRValue
export const auth = async (QRValueSvelte) => {


	$connectionStatus = false;
   $loadingRoot = true
   const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
         QRValueSvelte,
      }),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
   
   })
   
   const json = await res.json()
   
   if(json.error){console.log(json.error);$loadingRoot = false;$connectionStatus = false;$connectionAttempted = true;return}
   
   fmData()

   /*result = JSON.stringify(json)*/ 

}


export const fmData = async () => {
   $connectionStatus = false;
   $loadingRoot = true
   const res = await fetch('/api/familydata', {
      method: 'GET'
   })
   
   const json = await res.json()
   $loadingRoot = false
   
   if(json.error){console.log(json.error);$connectionStatus = false; return}
   //set global connectionstatus
   
   $formValuesRoot = json.data.allFamilies.nodes[0]
   //$familyStore = formValues
   /*result = JSON.stringify(json)*/ 
   $connectionStatus = true;
   $connectionAttempted = true

}
</script>