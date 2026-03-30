#!/bin/bash
cd src/app/\(playground\)/playground/sql

# Module 03
sed -n '634,1081p' template-page.jsx > components/modules/Module03.jsx
sed -i '1i "use client";\nimport React, { useState, useEffect } from "react";\nimport { T, PLAT } from "../sql-constants";\nimport { EMP, gc } from "../data";\nimport { SQLBlock, SLabel, Hint, Course, CommonMistakes, Quiz, Note, Tip } from "../sql-shared";\n' components/modules/Module03.jsx
sed -i 's/function Module03/export default function Module03/' components/modules/Module03.jsx

# Module 04
sed -n '1082,1297p' template-page.jsx > components/modules/Module04.jsx
sed -i '1i "use client";\nimport React, { useState, useRef } from "react";\nimport { T, PLAT } from "../sql-constants";\nimport { ORDERS, CUSTS, EMP, gc } from "../data";\nimport { SQLBlock, SLabel, Hint, Course, CommonMistakes, Quiz, Note, Tip, Warn } from "../sql-shared";\n' components/modules/Module04.jsx
sed -i 's/function Module04/export default function Module04/' components/modules/Module04.jsx

