import re

import pyparsing as pp

special_requirement_literals = pp.one_of(
    [
        "3rd year mechanical engineering",
        "4u biology",
        "4u calculus and vectors (mcv4u)",
        "4u chemistry",
        "4u chimie",
        "a language test",
        "a strong theoretical foundation in contemporary art and exhibition practice",
        "active knowledge of english or french",
        "admission au b.a",
        "admission to the accelerated honours b.a in translation program (2 years)",
        "advanced functions",
        "advanced functions (mhf4u)",
        "an equivalent",
        "analysis",
        "approval of the instructor",
        "approval of the program director",
        "audition compulsory",
        "audition",
        "avoir suivi avec succès tous les cours obligatoires du programme m.g.s.s",
        "basic knowledge of third year-level undergraduate engineering mathematics",
        "biomedical mechanical engineering studies",
        "calcul différentiel et vecteurs 4u",
        "calcul et vecteurs (mcv4u)",
        "calculus and vectors 4u",
        "calculus and vectors (mcv4u)",
        "cegep linear algebra",
        "completion of all compulsory courses",
        "connaissance fondamentale de français",
        "cours sénior ou de niveau supérieur en physique de l'état solide",
        "enrolment is subject to approval by the administration",
        "equivalent",
        "equivalent placement test score",
        "equivalents",
        "être inscrit au certificat en études des francophonies",
        "fonctions avancées",
        "fonctions avancées 4u de l'ontario (mhf4u)",
        "graduate standing",
        "honours undergraduate algebra",
        "introduction au calcul différentiel 4u",
        "introductory calculus 4u",
        "knowledge of electromagnetic theory",
        "knowledge of neuroanatomy",
        "l'équivalent",
        "mathématiques 4u de l'ontario (mcv4u)",
        "mathématiques 4u de l'ontario calcul et vecteurs (mcv4u)",
        "ontario 4u advanced functions (mhf4u)",
        "ontario 4u calculus and vectors (mcv4u)",
        "ontario 4u functions (mhf4u)",
        "ontario 4u mathematics of data management (mdm 4u)",
        "ontario grade 11 functions (mcr3u)",
        "paper to be prepared under the direction of a professor in the department",
        "passive knowledge of french",
        "passive knowledge of the other language",
        "permission écrite du superviseur",
        "permission de la direction de la clinique",
        "permission de l'école",
        "permission du département",
        "permission du responsable du programme",
        "permission from the instructor",
        "permission of instructor required",
        "permission of the course coordinator",
        "permission of the department",
        "permission of the school",
        "permission of the school of music",
        "pointage satisfaisant au test de classement",
        "selon les thèmes du cours",
        "subject to the consent of the professor and the student services centre",
        "successful completion of the comprehensive examination",
        "the cegep linear algebra course",
        "the equivalent",
        "the permission ofthe department",
        "the permission of the department",
        "topology",
        "two of the 4u science or mathematics courses",
        "un test de langue",
        "une connaissance de la neuroanatomie",
        "written approval from the program",
    ],
    caseless=True,
)

conjunction = pp.Forward().set_results_name("conjunction")

# fmt: off
requirement = (
    pp.Regex(r"[a-zA-Z]{3,4} ?\d{4,5} with a grade of \w( or higher)?")
    | pp.Regex(r"[a-zA-Z]{3,4} ?\d{4,5}")
    | pp.dict_of(pp.Regex(r"\d+ university course units, including "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ university course units including "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ university units including "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ course units including "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ \w{3} units including "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ units in \w+( \w+)? including"), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ course units from "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ units from( |:)"), conjunction)
    | pp.Regex(r"\d+ course units in .+ \(\w{3}\) at the \d+ level with a minimum CGPA of \d+\.\d+")
    | pp.Regex(r"\d+ course units in .+ \(\w{3}\) at the \d+ (and|or) \d+ level")
    | pp.Regex(r"\d+ course units in .+ \(\w{3}\) at the \d+ level or above")
    | pp.Regex(r"\d+ course units in .+ \(\w{3}\) at the \d+(-| )level")
    | pp.Regex(r"\d+ course units in .+ \(\w{3}\)")
    | pp.Regex(r"\d+ course units in \w{3}")
    | pp.Regex(r"\d+ course units")
    | pp.Regex(r"\d+ university course (units|credits) in .+ \(\w{3}\)")
    | pp.Regex(r"\d+ university course (units|credits) at the (\d+|graduate)(-| )level")
    | pp.Regex(r"\d+ university course (units|credits)")
    | pp.Regex(r"\d+ university (units|credits) at the \d+(-| )level")
    | pp.Regex(r"\d+ university (units|credits)")
    | pp.Regex(r"\d+ units among compulsory core courses")
    | pp.Regex(r"\d+ units of university-level course")
    | pp.Regex(r"\d+ units at the \d+, \d+, \d+ or \d+ level")
    | pp.Regex(r"\d+ units \(P\) at the \d+( |-)level")
    | pp.Regex(r"\d+ units in \w{3} courses at level \d+( or above)?")
    | pp.Regex(r"\d+ units in \w{3}\/\w{3}")
    | pp.Regex(r"\d+ units in \w{3}")
    | pp.Regex(r"\d+ .+ \(\w{3}\) units")
    | pp.Regex(r"\d+ \w{3} units")
    | pp.Regex(r"permission of the \w{3} program director")
    | pp.Regex(r"student must have completed \d+ units at \d+ level within the field", re.I)
    | pp.Regex(r"the student must have a minimum CGPA of \d+\.\d+", re.I)
    | pp.Regex(r"(a )?minimum CGPA of \d+\.\d+", re.I)
    | pp.dict_of(pp.Regex(r"\d+ crédits de cours universitaires incluant "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ crédits universitaires, incluant "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ crédits universitaires incluant "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ crédits \w{3} incluant "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ crédits incluant "), conjunction)
    | pp.dict_of(pp.Regex(r"\d+ crédits de cours parmi "), conjunction)
    | pp.Regex(r"\d+ crédits de cours universitaires de niveau \d+ (et|ou) \d+")
    | pp.Regex(r"\d+ crédits de cours universitaires de niveau \d+")
    | pp.Regex(r"\d+ crédits de cours universitaires?")
    | pp.Regex(r"\d+ crédits universitaires de niveau \d+ (et|ou) \d+")
    | pp.Regex(r"\d+ crédits universitaires")
    | pp.Regex(r"\d+ crédits de cours en \w+\/\w+ \(\w{3}\/\w{3}\)")
    | pp.Regex(r"\d+ crédits de cours en .+ \(\w{3}\) de niveau \d+ ou \d+")
    | pp.Regex(r"\d+ crédits de cours en .+ \(\w{3}\) de niveau \d+")
    | pp.Regex(r"\d+ crédits de cours en .+ \(\w{3}\)")
    | pp.Regex(r"\d+ crédits de cours du programme de \w+( \w+)?")
    | pp.Regex(r"\d+ crédits de cours en \w{3} ou \w{3} de niveau \d+")
    | pp.Regex(r"\d+ crédits de cours offerts par la \w+( \w+( \w+)?)? de niveau \d+ ou \d+")
    | pp.Regex(r"\d+ crédits de cours de niveau \d+ offerts par la \w+( \w+( \w+)?)?")
    | pp.Regex(r"\d+ crédits de cours \w{3} de niveau \d+ ou (\d+|supérieur)")
    | pp.Regex(r"\d+ crédits de cours \w{3} de niveau \d+")
    | pp.Regex(r"\d+ crédits de cours parmi les cours du \w+( \w+)?")
    | pp.Regex(r"\d+ crédits de cours")
    | pp.Regex(r"\d+ crédits de niveau \d+")
    | pp.Regex(r"\d+ crédits \w{3}\/\w{3}")
    | pp.Regex(r"\d+ crédits \w{3}")
    | pp.Regex(r"permission du directeur du programme de \w{3}")
    | pp.Regex(r"au moins \w+ crédits de cours \w{3} au niveau \d+", re.I)
    | pp.Regex(r"l'étudiant ou l'étudiante doit avoir complété \d+ crédits au niveau \d+ dans le domaine", re.I)
    | special_requirement_literals
    | pp.Group(pp.Suppress("(") + conjunction + pp.Suppress(")"))
)
# fmt: on

disjunction = (
    pp.Opt(pp.Suppress(pp.one_of(["either", "completion of"], caseless=True)))
    + pp.Group(pp.DelimitedList(requirement, delim=pp.one_of(["or", "ou", "/"])))
) | (
    pp.Suppress(pp.one_of(["one of", "un de"], caseless=True))
    + pp.Group(pp.DelimitedList(requirement, delim=pp.one_of(["or", ","])))
)

conjunction << pp.DelimitedList(
    disjunction, delim=pp.one_of([",", "and", "et", ";", ", and"])
)

prerequisites_parser = (
    pp.Suppress(
        pp.one_of(
            [
                "Prerequisite",
                "Préalable",
                "Prerequisites",
                "Préalables",
            ],
            caseless=True,
        )
    )
    + pp.Suppress(":")
    + conjunction
    + pp.Opt(pp.Suppress("."))
)
