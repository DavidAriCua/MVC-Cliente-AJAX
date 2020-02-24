       // MODELO DE DATOS

       let mis_peliculas_iniciales = [
        {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png"},
        {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png"},
        {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png"}
     ];

     let mis_peliculas = [];

     const postAPI = async (peliculas) => {
         try {
             const response = await fetch("https://api.myjson.com/bins", {
               method: 'POST', 
               headers:{
                   "Content-Type": "application/json",
               },
               body: JSON.stringify(peliculas)
             });
             const {uri} = await response.json();
             return uri;               
         } catch (e) {
             show('response', `Error: ${e}`);
         }
     }
     const getAPI = async () => {
         try {
             let response = await fetch(localStorage.URL);
             let myJson = await response.json();
             return myJson;
         } catch (e) {
             show('response', `Error: ${e}`);
         }
     }
     const updateAPI = async (peliculas) => {
         try {
           const response = await fetch(localStorage.URL, {
             method: 'PUT',
             headers:{
                 "Content-Type": "application/json",
             },
             body: JSON.stringify(peliculas)
             });
             const {uri} = await response.json();
             return uri;
         } catch (e) {
             alert('Error');
         }
     }


     // VISTAS
     
     const indexView = (peliculas) => {
         let i=0;
         let view = "";

         while(i < peliculas.length) {
           view += `
             <div class="movie">
                <div class="movie-img">
                     <img class="show" data-my-id="${i}" src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
                </div>
                <div class="title">
                    ${peliculas[i].titulo || "<em>Sin título</em>"}
                </div>
                <div class="actions">
                    <button class="edit" data-my-id="${i}">editar</button>
                    <button class="show" data-my-id="${i}">Ver</button>
                    <button class="delete" data-my-id="${i}">Borrar</button>

                 </div>
             </div>\n`;
           i = i + 1;
         };

         view += `<div class="actions">
                     <button class="new">Añadir</button>
                     <button class="reset">Reset</button>
                 </div>`;

         return view;
     }

     const editView = (i, pelicula) => {
         return `<h2>Editar Película </h2>
             <div class="field">
             Título <br>
             <input  type="text" id="titulo" placeholder="Título" 
                     value="${pelicula.titulo}">
             </div>
             <div class="field">
             Director <br>
             <input  type="text" id="director" placeholder="Director" 
                     value="${pelicula.director}">
             </div>
             <div class="field">
             Miniatura <br>
             <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                     value="${pelicula.miniatura}">
             </div>
             <div class="actions">
                 <button class="update" data-my-id="${i}">
                     Actualizar
                 </button>
                 <button class="index">
                     Volver
                 </button>
            `;
     }

     const showView = (pelicula) => {
         return `
          <p>
             <h2>Información de la Película </h2>
             <div class="field">
             <h4> Título: </h4>
             ${pelicula.titulo}
             </div>
             <div class="field">
             <h4> Director: </h4>
             ${pelicula.director}
             </div>
          </p>
          <div class="actions">
             <button class="index">Volver</button>
          </div>`;

     }

     const newView = () => {
         return `<h2>Crear Película</h2>
         <div class="field">
             Título <br>
             <input  type="text" id="titulo" placeholder="Título" 
                     value="">
             </div>
             <div class="field">
             Director <br>
             <input  type="text" id="director" placeholder="Director" 
                     value="">
             </div>
             <div class="field">
             Miniatura <br>
             <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                     value="">
             </div>

             <div class="actions">
                 <button class="index">Volver</button>
                 <button class="create">Crear</button>
             </div>`;
     }


     // CONTROLADORES 

     const initContr = async () => {
         if (!localStorage.URL) {
             localStorage.URL = await postAPI(mis_peliculas_iniciales);
         }
         indexContr();
     }

     const indexContr = async () => {
         mis_peliculas = await getAPI() || [];
         document.getElementById('main').innerHTML = await indexView(mis_peliculas);
     }

     const showContr = (i) => {
         document.getElementById('main').innerHTML = showView(pelicula);
     }

     const newContr = () => {
         document.getElementById('main').innerHTML = newView(mis_peliculas);
     }

     const createContr = async () => {
         let titulo = document.getElementById('titulo').value;
         let director = document.getElementById('director').value;
         let miniatura = document.getElementById('miniatura').value;
         mis_peliculas.push({titulo: titulo,   director: director, "miniatura": miniatura});
         await updateAPI(mis_peliculas);
         indexContr();
     }

     const editContr = (i) => {
         document.getElementById('main').innerHTML = editView(i,  mis_peliculas[i]);
     }

     const updateContr = async (i) => {
         mis_peliculas[i].titulo   = document.getElementById('titulo').value;
         mis_peliculas[i].director = document.getElementById('director').value;
         mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
         await updateAPI(mis_peliculas);
         indexContr();
     }

     const deleteContr = async (i) => {
         if (confirm(`Borrar ${mis_peliculas[i].titulo}`)) {
         mis_peliculas.splice(i,1);
         await updateAPI(mis_peliculas);
         indexContr();
       }

     }

     const resetContr = async () => {
         await updateAPI(mis_peliculas_iniciales);
         indexContr();
     }

     // ROUTER de eventos
     const matchEvent = (ev, sel) => ev.target.matches(sel)
     const myId = (ev) => Number(ev.target.dataset.myId)

     document.addEventListener('click', ev => {
         if      (matchEvent(ev, '.index'))  indexContr  ();
         else if (matchEvent(ev, '.edit'))   editContr   (myId(ev));
         else if (matchEvent(ev, '.update')) updateContr (myId(ev));
         else if (matchEvent(ev, '.show')) showContr (myId(ev));
         else if (matchEvent(ev, '.delete')) deleteContr (myId(ev));
         else if (matchEvent(ev, '.new')) newContr (myId(ev));
         else if (matchEvent(ev, '.create')) createContr (myId(ev));
         else if (matchEvent(ev, '.reset')) resetContr (myId(ev));

     })
     
     
     // Inicialización        
     document.addEventListener('DOMContentLoaded', initContr);