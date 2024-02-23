from typing import List, Optional

from kor import from_pydantic
from kor.extraction import create_extraction_chain
from pydantic import BaseModel, Field


class CourseRequirements(BaseModel):
    student_program: Optional[str] = Field(
        description="The program relevant to these course requirements. This does not include any requirements.",
        examples=[
            (
                "Prerequisites: CSI 2110, CSI 2101 or for honors mathematics students: CSI 2110, (MAT 2141 or MAT 2143).",
                "honors mathematics",
            ),
        ],
    ),
    prerequisites: str = Field(
        description="Prerequisite courses a student must take in order to enroll in a class. Provide the courses in a format where '&' species a conjunction between two classes that must have been taken, '|' species a disjunction between two classes where either class could have been taken, and '(' and ')' groups together a set of prerequisite courses in the same format previously described.",
        examples=[
            (
                "Préalables: PSY 1501, PSY 1502, PSY 2701.",
                "PSY 1501&PSY 1502&PSY 2701",
            ),
            (
                "Préalables: PSY 1501, PSY 1502, PSY 2701.",
                "PSY 1501&PSY 1502&PSY 2701",
            ),
            (
                "Prerequisites: One of Calculus and Vectors (MCV4U) or MAT 1339.",
                "Calculus and Vectors (MCV4U)|MAT 1339",
            ),
            (
                "Prerequisite: One of Advanced Functions (MHF4U) or MAT 1318 or an equivalent",
                "Advanced Functions (MHF4U)|MAT 1318|an equivalent",
            ),
            (
                "Prerequisites: MAT 1341, ((MAT 2371, MAT 2375) or MAT 2377)",
                "MAT 1341&((MAT 2371&MAT 2375)|MAT 2377)",
            ),
            (
                "Prerequisites: CSI 2132, (CSI 3120 or SEG 2106), MAT 2377 or (MAT 2371 and MAT 2375).",
                "CSI 2132&(CSI 3120|SEG 2106)&(MAT 2377|(MAT 2371&MAT 2375))",
            ),
            (
                "Prerequisite: undergraduate honours algebra, including group theory and finite fields.",
                "undergraduate honours algebra&group theory&finite fields",
            ),
            (
                "Préalable: MAT 3520 ou MAT 3553.", 
                "MAT 3520|MAT 3553",
            ),
            (
                "Préalables: MAT 2543, MAT 3520, (MAT 3541 ou MAT 3543 ou MAT 3741).",
                "MAT 2543&MAT 3520&(MAT 3541|MAT 3543|MAT 3741)",
            ),
        ],
    ),
    corequisites: str = Field(
        description="Corequisite courses a student must take in order to enroll in a class. Provide the courses in a format where '&' species a conjunction between two classes that must take, '|' species a disjunction between two classes where either class could be taken, and '(' and ')' groups together a set of corequisite courses in the same format previously described.",
        examples=[
            (
                "ITI 1120, ENG 1112 are corequisite to SEG 2900.",
                "ITI 1120&ENG 1112",
            ),
            (
                "PSY 3307 is corequisite to PSY 4276",
                "PSY 3307",
            ),
        ],
    ),
    requirements: List[str] = Field(
        description="None prerequisites and corequisite requirements that a student must meet in order to enroll in the class.",
        examples=[
            (
                "Prerequisites: Student must be in the 4th year of an Honours program in Mathematics or Statistics, with a minimum CGPA of 7.0, and obtain the permission of the Department.",
                [
                    "Student must be in the 4th year of an Honours program in Mathematics or Statistics",
                    "minimum CGPA of 7.0",
                    "obtain the permission of the Department",
                ],
            ),
            (
                "Préalables: 9 crédits de cours en informatique (CSI) ou génie logiciel (SEG) de niveau 3000 ou 4000.",
                [
                    "9 crédits de cours en informatique (CSI) ou génie logiciel (SEG) de niveau 3000 ou 4000"
                ],
            ),
            (
                "Prerequisites: 12 course units in CSI or SDS at the 3000 level.",
                [
                    "12 course units in CSI or SDS at the 3000 level",
                ],
            ),
            (
                "Prerequisites: Course reserved for students registered in the Software Engineering Program.",
                [
                    "registered in the Software Engineering Program",
                ],
            ),
            (
                "Préalables: Réservé aux étudiants et étudiantes inscrits au Baccalauréat en génie logiciel.",
                [
                    "inscrits au Baccalauréat en génie logiciel",
                ],
            ),
        ],
    )

from langchain.llms import HuggingFaceEndpoint

endpoint_url = (
    "https://nrush39pk5hhu876.us-east-1.aws.endpoints.huggingface.cloud"
)
hf = HuggingFaceEndpoint(
    endpoint_url=endpoint_url,
    huggingfacehub_api_token="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"
)
hf.task = 'text-generation'

schema, validator = from_pydantic(
    CourseRequirements,
    description="Requirements for a student to enroll in a course including the course's prerequisites and corequisites",
    examples=[
        (
            "Prerequisite: 81 university units including PSY 1101, PSY 1102, PSY 2106, PSY 2116, PSY 2174, PSY 3307. PSY 3307 is corequisite to PSY 4276. A CGPA of at least 8.0 is required.",
            [
                {
                    "student_program": None,
                    "prerequisites": "PSY 1101&PSY 1102&PSY 2106&PSY 2116&PSY 2174",
                    "corequisites": "PSY 3307",
                    "requirements": [
                        "81 university units", 
                        "CGPA of at least 8.0",
                    ],
                }
            ],
        ),
        (
            "Préalables: PSY 1501, PSY 1502, PSY 2701. Réservé aux étudiants et étudiantes inscrits aux programmes bidisciplinaires, de majeure et spécialisé en psychologie.",
            [
                {
                    "student_program": None,
                    "prerequisites": "PSY 1501&PSY 1502&PSY 2701",
                    "corequisites": None,
                    "requirements": [
                        "inscrits aux programmes bidisciplinaires, de majeure et spécialisé en psychologie"
                    ],
                }
            ],
        ),
        (
            "Prerequisites: CSI 2110, CSI 2101 or for honors mathematics students: CSI 2110, (MAT 2141 or MAT 2143).",
            [
                {
                    "student_program": None,
                    "prerequisites": "CSI 2110&CSI 2101",
                    "corequisites": None,
                    "requirements": [],
                },
                {
                    "student_program": "honors mathematics",
                    "prerequisites": "CSI 2110&(MAT 2141|MAT 2143)",
                    "corequisites": None,
                    "requirements": [],
                },
            ],
        ),
    ],
    many=True
)

chain = create_extraction_chain(hf, schema, encoder_or_encoder_class="json", validator=validator)
# print(chain.prompt.format_prompt(text="Prerequisites: 12 course units in CSI or SDS at the 3000 level.").to_string())
print(chain.run(("Prerequisites: 12 course units in CSI or SDS at the 3000 level.")))
