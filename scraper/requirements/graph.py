import json
import uuid
import builtins
import re
import collections

from scraper.settings import filesystem
from scraper.requirements.parser import prerequisites_parser

COURSES = json.loads(filesystem.get("courses.json"))
EXCEPTIONS = {
    "iti1121": "Prerequisite: ITI 1120.",
    # "sds3386": "Prerequisites: ITI 1120, ((MAT 2375) or MAT 2377).",
}


class RequirementNode:
    def __init__(
        self, parsed_requirement: str | list | dict, label: str | None = None
    ) -> None:
        self.children = []
        self.label = label

        match type(parsed_requirement):
            case builtins.str:
                self.label = str(parsed_requirement).strip()
            case builtins.list:
                self.label = "one of"
                self.children.extend(map(RequirementNode, parsed_requirement))
            case builtins.dict:
                if "conjunction" in parsed_requirement:
                    self.children.extend(
                        map(RequirementNode, parsed_requirement["conjunction"])
                    )
                else:
                    self.label = next(iter(parsed_requirement.keys())).strip()
                    self.children.extend(
                        map(RequirementNode, parsed_requirement[self.label])
                    )

        self.flatten_children()

    def __str__(self) -> str:
        if len(self.children) == 0:
            return self.label or ""

        return f"({self.label}:[{','.join(map(str, self.children))}])"

    def is_leaf_node(self) -> bool:
        return len(self.children) == 0

    def is_course_node(self) -> bool:
        return self.label != None and bool(
            re.match(r"[a-zA-Z]{3,4} ?\d{4,5}", self.label)
        )

    def flatten_children(self) -> None:
        unflattened_children = self.children
        flattened_children = []
        while len(unflattened_children) > 0:
            child = unflattened_children.pop()

            if len(child.children) == 1 and child.label in [None, "one of"]:
                unflattened_children.extend(child.children)
            else:
                flattened_children.append(child)

        self.children = flattened_children


def expand_node(root: RequirementNode, locale: str, depth: int = 10000) -> None:
    queue = collections.deque([root])

    while len(queue) > 0 and depth > 0:
        for _ in range(len(queue)):
            node = queue.pop()

            if node.is_course_node() and node.is_leaf_node():
                course_code = node.label.replace(" ", "").lower()

                if course_code in COURSES:
                    requirement = COURSES[course_code].get("requirements") or {}

                    if locale in requirement:
                        locale_requirement = requirement[locale]
                    else:
                        locale_requirement = next(iter(requirement.values()), None)

                    try:
                        parsed_requirement = prerequisites_parser.parse_string(
                            locale_requirement
                        ).as_dict()

                        node.children = RequirementNode(parsed_requirement).children
                    except:
                        pass

            queue.extendleft(node.children)

        depth -= 1

    root.flatten_children()


tree = RequirementNode("CSI 3120")
expand_node(tree, "en", depth=1)
print(tree)
