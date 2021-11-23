document.getElementsByClassName("publish")[0].addEventListener('click', function(event){
    fetch('http://127.0.0.1:8090/publish')
     .then(response => response.text())
     // response.ok
     .then(body =>
        document.getElementById('content').innerHTML=body)
     .catch( (error => alert(error)))
  });

document.addEventListener("DOMContentLoaded",function(event){
   fetch('http://127.0.0.1:8090/main')
   .then(response => response.text())
   // response.ok
   .then(body =>
      document.getElementById('content').innerHTML=body)
   .catch( (error => alert(error)))
})
