$(start);

function start() {
    $('#nome').focus();
    loadStates();
    loadMonth();
    loadYear();

    $('#generator-btn').click(buildJson);
    $('#add-experience').click(addExperience);
    $('#add-education').click(addEducation);
    $('#add-language').click(addLanguage);
    $('#add-skill').click(addSkill);
}

function loadStates() {
    $.getJSON('json/Estados.json', function(data) {
        var options = '';

        $.each(data, function() {
            var option = '';

            option += '<option value="' + this.ID + '">';
            option += this.Sigla + '</option>';

            options += option;
        });

        $('#estado').html(options).change();
    });

    $('#estado').change(function() {
        loadCidades($(this).val());
    });
}

function loadCidades(state) {
    $.getJSON('json/Cidades.json', function(data) {
        var options = '';

        $.each(data, function() {
            if(this.Estado === state) {
                var option = '';

                option += '<option value="' + this.ID +'">';
                option += this.Nome + '</option>';

                options += option;
            }
        });

        $('#cidade').html(options);
    });
}

function loadMonth() {
    var options = '',
        months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    $.each(months, function(k, v) {
        var option = '';

        option += '<option value="' + (k + 1) + '">';
        option += v + '</option>';

        options += option;
    });

    $('.month').html(options);
}

function loadYear() {
    var today = new Date(),
        thisYear = today.getUTCFullYear(),
        options = '';

    for(i = (thisYear - 100); i <= (thisYear + 50); i++) {
        var option = '';

        option += '<option value="' + i + '"';
        if(i === thisYear) option += ' selected';
        option += '>' + i + '</option>';

        options += option;
    }

    $('.year').html(options);
}

function addExperience() {
    $('#experiences').append($('#experience-template').html());
}

function addEducation() {
    $('#educations').append($('#education-template').html());
}

function addLanguage() {
    $('#languages').append($('#languages-template').html());
}

function addSkill() {
    $('#skills').append($('#skills-template').html());
}

function buildJson() {
    var json = {
        "dadosPessoais": [
            {
                "nome": "Rafael Ferraz Zanetti",
                "endereco": "Rua Paschoal Leite Paes, 335 - Vila Progresso",
                "cidade": "Sorocaba",
                "estado": "SP",
                "telefone": "(15) 99744-3347",
                "email": "rfzanetti@gmail.com"
            }
        ],
        "experiencias": [
            {
                "inicio": "05/2016",
                "fim": "07/2016",
                "titulo": "Aluno-Pesquisador",
                "empresa": "Wisconsin Human-Computer Interaction Laboratory",
                "detalhes": "Desenvolvi, utilizando C++, o comportamento de um pequeno robô humanoide voltado a interação com crianças. Desenvolvi um simples sistema de recomendação de livros baseados no interesse da criança, trabalhei com sistemas de detecção facial, detecção de April Tags e leitura de cartões RFID."
            }
        ],
        "formacoes": [
            {
                "inicio": "2013",
                "fim": "2017",
                "grau": "Bacharel",
                "area": "Ciência da Computação",
                "instituicao": "UFSCar Sorocaba",
                "detalhes": "Monitor das disciplinas de Algoritmos e Programação I e II"
            },
            {
                "inicio": "2015",
                "fim": "2016",
                "grau": "Aluno Visitante",
                "area": "Ciência da Computação",
                "instituicao": "University of Wisconsin-Madison (EUA)",
                "detalhes": "Graduacao-Sanduíche pelo Programa Ciência Sem Fronteiras."
            }
        ],
        "idiomas": [
            {
                "lingua": "Português",
                "nivel": "Nativo"
            },
            {
                "lingua": "Inglês",
                "nivel": "Fluente"
            },
            {
                "lingua": "Espanhol",
                "nivel": "Básico"
            }
        ],
        "habilidades": [
            {
                "nome": "Python"
            },
            {
                "nome": "C"
            },
            {
                "nome": "C++"
            }
        ]
    };

    generateCV(json);
}

function generateCV(json) {
    var jqxhr = $.ajax({
        url: 'http://localhost:5000/cv',
        type: 'POST',
        data: JSON.stringify(json),
        contentType: 'application/json; charset=UTF-8'
    })
        .done(function(data) {
            console.log('Done!');

            downloadCV(data);
        })
        .fail(function() {
            console.log('Fail!');

            alert('Fail!');
        })
        .always(function() {
            console.log('Always!');
        });
}

function downloadCV(fileName) {
    window.location.href = 'http://localhost:5000/' + fileName;
}