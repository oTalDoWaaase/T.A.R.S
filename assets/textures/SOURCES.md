# Mapas dos globos interativos

`maps.js` é um arquivo gerado com JPEGs otimizados e incorporados como data URLs. Isso permite usar os mapas mesmo ao abrir `index.html` diretamente, sem as restrições de origem de texturas WebGL em arquivos locais. Não contém bibliotecas ou serviços externos.

## Recursos NASA

Fonte: [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources), revisão `11ebb4ee043715aefbba6aeec8a61746fad67fa7`.

O README da coleção declara que os recursos são livres e sem copyright, com [orientações de uso de imagens e mídia da NASA](https://www.nasa.gov/nasa-brand-center/images-and-media). O uso não implica endosso da NASA. Não são utilizados logotipos da agência.

| Corpo    | Caminho na coleção                                              | Observação                                                                                           |
| -------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Marte    | `Images and Textures/Mars/Mars.jpg`                             | Mapa histórico de superfície                                                                         |
| Júpiter  | `Images and Textures/Jupiter/Jupiter.jpg`                       | Atmosfera histórica; não representa o estado atual das tempestades                                   |
| Saturno  | `Images and Textures/Saturn/Saturn.jpg`                         | Mapa atmosférico; anéis construídos geometricamente                                                  |
| Encélado | `Images and Textures/Saturn - Enceladus/Saturn - Enceladus.jpg` | Mapa de superfície                                                                                   |
| Vênus    | `Images and Textures/Venus/Venus.jpg`                           | Superfície em cores representativas, a partir de radar; não é a aparência externa através das nuvens |
| Netuno   | `Images and Textures/Neptune/Neptune.jpg`                       | Imagem histórica em cores processadas; a cor real é mais suave                                       |

## Terra e Lua

Recursos distribuídos pelo [repositório three.js](https://github.com/mrdoob/three.js), sob MIT, com licença preservada em `THREE-MIT.txt`:

- `examples/textures/planets/earth_atmos_2048.jpg`
- `examples/textures/planets/moon_1024.jpg`

São utilizados **somente os arquivos de textura**, não o motor three.js ou dependências. Os arquivos foram obtidos da branch `dev` durante esta implementação; a revisão observada foi `e39fc164798525f558f8c3eba2fc8c0a543cc953`.

## Superfícies e estruturas procedurais

Mercúrio e Urano têm superfícies procedurais inspiradas em suas características visuais conhecidas, sem afirmar a localização de crateras ou detalhes reais. As nuvens externas de Vênus também são ilustrativas; o botão de superfície revela o mapa de radar.

Estrelas, galáxias, teia e horizonte observável são representações artísticas interativas, não dados observacionais ou simulações físicas. O anel do horizonte é uma metáfora do limite da observação; não uma parede do universo. Os mapas, a iluminação e as velocidades de rotação são educativos e não estão em escala física.
