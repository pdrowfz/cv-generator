#!flask/bin/python
# -*- coding: utf-8 -*-
from flask import Flask, request, abort, jsonify
from flask_cors import CORS, cross_origin
import time, json, os, subprocess

def geraCurriculo(dados):
    content = r'''\documentclass[a4paper,10pt]{article}
    \usepackage{hyperref}
    \usepackage[portuguese]{babel}
    \usepackage[T1]{fontenc}
    \usepackage[utf8]{inputenc}
    \begin{document}
    \pagestyle{empty}
    '''

    dp = DadosPessoais(dados["dadosPessoais"][0])
    content += str(dp)

    exp = Experiencias(dados["experiencias"])
    content += str(exp)

    form = Formacoes(dados["formacoes"])
    content += str(form)

    idiom = Linguas(dados["idiomas"])
    content += str(idiom)

    hab = Habilidades(dados["habilidades"])
    content += str(hab)

    content += "\end{document}"

    ms = int(round(time.time() * 1000))
    texFileName = "static/" + str(ms) + ".tex"

    with open(texFileName,'w') as f:
        f.write(content)

    cmd = "pdflatex -interaction nonstopmode " + texFileName 
    os.system(cmd)

    os.unlink(texFileName)
    log = str(ms) + ".log"
    os.unlink(log)
    aux = str(ms) + ".aux"
    os.unlink(aux)
    out = str(ms) + ".out"
    os.unlink(out)

    cmd = "mv " + str(ms) + ".pdf static/"
    os.system(cmd)

    return "static/" + str(ms) + ".pdf"

class DadosPessoais():
    def __init__(self, dadosPessoaisJSON):
        self.nomeCompleto = dadosPessoaisJSON["nome"]
        self.endereco = dadosPessoaisJSON["endereco"]
        self.cidade = dadosPessoaisJSON["cidade"]
        self.estado = dadosPessoaisJSON["estado"]
        self.telefone = dadosPessoaisJSON["telefone"]
        self.email = dadosPessoaisJSON["email"]

    def __str__(self):
        texCode = r'''\par{\centering{\Huge \textsc{'''
        texCode += self.nomeCompleto
        texCode += r'''}}\bigskip\par}'''
        texCode += r'''\section*{\textsc{Dados Pessoais}}\begin{tabular}{rl}\textsc{Endereco:}   & '''
        texCode += self.endereco
        texCode += ', '
        texCode += self.cidade
        texCode += '/'
        texCode += self.estado
        texCode +=  r'''\\ \textsc{Telefone:}     & '''
        texCode += self.telefone
        texCode += r'''\\ \textsc{email:}     & \href{'''
        texCode += self.email 
        texCode += '}{'
        texCode += self.email
        texCode += r'''}\end{tabular}'''

        return texCode

class ExperienciaProfissional():
    def __init__(self, experienciaJSON):
        self.inicio = experienciaJSON["inicio"]
        self.fim = experienciaJSON["fim"]
        self.titulo = experienciaJSON["titulo"]
        self.empresa = experienciaJSON["empresa"]
        self.detalhes = experienciaJSON["detalhes"]

    def __str__(self):
        texCode = r'''\textsc{'''
        texCode += self.inicio
        texCode += '-'
        texCode += self.fim
        texCode += '} & '
        texCode += self.titulo
        texCode += r''' em  \textsc{'''
        texCode += self.empresa
        texCode += r'''}\\&\footnotesize{'''
        texCode += self.detalhes
        texCode += r'''}\\\multicolumn{2}{c}{} \\'''

        return texCode.encode("utf-8")

class Experiencias():
    def __init__(self, experienciasJSON):
        self.experiencias = []
        for experienciaJSON in experienciasJSON:
            self.experiencias.append(ExperienciaProfissional(experienciaJSON))
        

    def __str__(self):
        texCode = r'''\section*{\textsc{Experiência Profissional}}\begin{tabular}{r|p{11cm}}'''
        for experiencia in self.experiencias:
            texCode += str(experiencia)

        texCode += r'''\end{tabular}'''

        return texCode

class FormacaoAcademica():
    def __init__(self, formacaoJSON):
        self.inicio = formacaoJSON["inicio"]
        self.fim = formacaoJSON["fim"]
        self.grau = formacaoJSON["grau"]
        self.area = formacaoJSON["area"]
        self.instituicao = formacaoJSON["instituicao"]
        self.detalhes = formacaoJSON["detalhes"]

    def __str__(self):
        texCode = r'''\textsc{'''
        texCode += self.inicio
        texCode += r'''-'''
        texCode += self.fim
        texCode += r'''} & \textsc{'''
        texCode += self.grau
        texCode += r'''} em \textsc{'''
        texCode += self.area
        texCode += r'''}, \textbf{'''
        texCode += self.instituicao
        texCode += r'''}\\ & '''
        texCode += self.detalhes
        texCode += r'''\\'''

        return texCode.encode("utf-8")

class Formacoes():
    def __init__(self, formacoesJSON):
        self.formacoes = []
        for formacaoJSON in formacoesJSON:
            self.formacoes.append(FormacaoAcademica(formacaoJSON))

    def __str__(self):
        texCode = r'''\section*{\textsc{Educação}}\begin{tabular}{rl}   '''
        for formacao in self.formacoes:
            texCode += str(formacao)
        texCode += r'''\end{tabular}'''

        return texCode

class Lingua():
    def __init__(self, linguaJSON):
        self.lingua = linguaJSON["lingua"]
        self.nivel = linguaJSON["nivel"]

    def __str__(self):
        texCode = r'''\textsc{'''
        texCode += self.lingua
        texCode += ':}  & '
        texCode += self.nivel
        texCode += r'''\\'''

        return texCode.encode("utf-8")

class Linguas():
    def __init__(self, linguasJSON):
        self.linguas = []
        for linguaJSON in linguasJSON:
            self.linguas.append(Lingua(linguaJSON))

    def __str__(self):
        texCode = r'''\section*{\textsc{Idiomas}}\begin{tabular}{rl}'''
        for lingua in self.linguas:
            texCode += str(lingua)
        texCode += r'''\end{tabular}'''

        return texCode

class Habilidade():
    def __init__(self, habilidadeJSON):
        self.nome = habilidadeJSON["nome"]

    def __str__(self):
        texCode = r'''\textsc{'''
        texCode += self.nome
        texCode += '}'
        return texCode

class Habilidades():
    def __init__(self, habilidadesJSON):
        self.habilidades = []
        for habilidadeJSON in habilidadesJSON:
            self.habilidades.append(Habilidade(habilidadeJSON))

    def __str__(self):
        texCode = r'''\section*{\textsc{Habilidades}}'''
        for habilidade in self.habilidades:
            texCode += str(habilidade)
            texCode += ", "
        texCode = texCode[:-2]

        return texCode

app = Flask(__name__)
CORS(app)

@app.route('/cv', methods=['POST'])
def cv_generator():
    if not request.json:
        abort(400)

    fileName = geraCurriculo(request.json)

    return fileName

if __name__ == '__main__':
    app.run(debug=True)