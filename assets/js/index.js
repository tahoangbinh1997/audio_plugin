$( document ).ready(function (){
    $.getJSON('playlist.json', function (data){
        let playlist = data.playlist
        $('#list_audio').createAudio({listMusic: playlist})
    })
})
