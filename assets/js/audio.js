(function ($) {
    $.fn.createAudio = function (params) {
        params = $.extend(
            {
                animEffect: 'swing',
                animSpeed: 500
            }, params
        )

        let dataPlayList = params.listMusic
        this.each(function (idx, el) {

            //Tạo các thẻ dom như tên bài hát, thẻ audio, playlist, các nút bấm
            let songName = document.createElement('h3')
            songName.setAttribute('class', 'song-name')
            let songAuthor = document.createElement('h3')
            songAuthor.setAttribute('class', 'song-author')

            //Tạo div để chứa thẻ audio
            let audioBase = document.createElement('div')
            audioBase.setAttribute('id', 'audio_base')

            //Tạo thẻ audio
            let audio = document.createElement('audio')
            audio.setAttribute('controls', 'controls')
            audio.setAttribute('autoplay', 'true')
            audio.setAttribute('type', 'audio')
            audio.setAttribute('muted', 'muted')
            audio.setAttribute('id', 'music_base')

            let playlist = document.createElement('div')
            let ul = document.createElement('ul')
            playlist.setAttribute('class', 'playlist')

            let divButton = document.createElement('div')
            divButton.setAttribute('class', 'button-base')

            let btnPlay = document.createElement('button')
            btnPlay.setAttribute('id', 'play')
            btnPlay.textContent = 'play'

            let btnPause = document.createElement('button')
            btnPause.setAttribute('id', 'pause')
            btnPause.textContent = 'pause'

            let btnStop = document.createElement('button')
            btnStop.setAttribute('id', 'stop')
            btnStop.textContent = 'stop'

            let btnRandom = document.createElement('button')
            btnRandom.setAttribute('id', 'random')
            btnRandom.textContent = 'random'

            let btnVol = document.createElement('input')
            btnVol.setAttribute('id', 'vol')
            btnVol.setAttribute('type', 'range')
            btnVol.setAttribute('min', '0')
            btnVol.setAttribute('max', '100')

            //Append theo thứ tự vào giao diện
            playlist.append(ul)
            el.append(songName)
            el.append(songAuthor)
            el.append(audioBase)
            audioBase.append(audio)
            el.append(divButton)
            divButton.append(btnPlay)
            divButton.append(btnPause)
            divButton.append(btnStop)
            divButton.append(btnRandom)
            divButton.append(btnVol)
            el.append(playlist)

            let ul_playlist = $('.playlist ul')

            //Tạo biến để gọi đến các nút
            let btn = {
                play: $('#play'),
                pause: $('#pause'),
                stop: $('#stop'),
                random: $('#random'),
                vol: $('#vol')
            }

            //Tạo giao diện danh sách bài hát
            create_playlist(dataPlayList, ul_playlist)

            //gọi đến đối tượng dom có id là music_base vào biến music
            let music = document.getElementById('music_base')

            if (music) {

                //chọn ra bài với index và data của bài
                selectSong(0, dataPlayList[0])

                // khởi tạo biến playPromise để để trả về các log
                let playPromise = music.play()

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        music.play()
                    })
                        .catch(error => {
                            alert('Hiện tại audio không thể tự khởi động được, bạn vui lòng ấn vào nút play để chơi nhạc')
                        });
                }

                //Tạo biến để lưu âm lượng của audio khi load trang
                let inputVolume = music.volume * 100

                btn.vol.val(inputVolume)

                $('.playlist ul li').click(function () {
                    let index = $(this).attr('data-idx')
                    let currentMusic = dataPlayList[index]
                    selectSong(index, currentMusic)
                    music.play()
                })

                btn.play.on('click', function () {
                    music.play()
                })
                btn.pause.on('click', function () {
                    music.pause()
                })
                btn.stop.on('click', function () {
                    music.pause()
                    music.currentTime = 0
                })
                btn.vol.on('input', function (){
                    let volume = ($(this).val() / 100)
                    music.volume = volume
                })
                btn.random.on('click', function () {
                    let index = Math.floor(Math.random() * Math.floor(dataPlayList.length))
                    selectSong(index, dataPlayList[index])
                    music.play()
                })

                //Bắt sự kiện bài hát kết thúc
                music.addEventListener('ended', function () {
                    let index = ul_playlist.find('.active').data('idx')
                    if (index < dataPlayList.length - 1) {
                        selectSong(index + 1, dataPlayList[index + 1])
                        music.play()
                        return true
                    }
                    selectSong(0, dataPlayList[0])
                    music.play()
                })

                function selectSong(index, song) {
                    $('.playlist ul li').removeClass('active')
                    $('.playlist ul li').eq(index).addClass('active')
                    music.src = song.src
                    songName.textContent = 'Bài hát: ' + song.name
                    songAuthor.textContent = 'Thể hiện: ' + song.author
                }
            }

            function create_playlist(list, ele) {
                dataPlayList = list
                d = ''

                $.each(list, function (index, val) {
                    d += '<li data-idx="' + index + '">' + val.name + ' : ' + val.author + '</li>'
                })
                ele.empty().append(d)
                ele.find('li').first().addClass('active')
            }
        })
        return this
    }
}(jQuery))
