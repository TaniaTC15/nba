//Registrar el SW
let newSW;
if ('serviceWorker' in  navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(result =>{
            result.addEventListener('updatefound', () => {
                newSW = result.installing;
                console.log('Hay un nuevo SW', newSW)

                newSW.addEventListener('statechange', () => {
                    if(newSW.state == "installed"){
                        showSnackbar();
                    }
                })
            })
        })
        
    })
}

function showSnackbar() {
    // Get the snackbar DIV
    let x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
}
let botonActualizar = document.getElementById('launchUpdate')

botonActualizar.addEventListener('click', () => {
    console.log('Hacer el skipwaiting');
    window.location.reload(); 
    newSW.postMessage({action: 'skipWaiting'})
})

//DESDE AQUI SE JALA LA API 


