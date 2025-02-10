# pylint: disable=E0602
"""
Generate a navbar from the top level files and directories and a list of child
pages.
"""

import os
import pickle
import xml.etree.ElementTree as ET

pickle_path = os.path.join(document.output_dir, "..", "header.pickle")
if document.source_path == os.path.join(document.content_dir, "index.md"):
    print("Generating header with nav links...")

    header = ET.Element("header")

    nav_list = ET.SubElement(ET.SubElement(header, "nav"), "ul")

    link = ET.SubElement(ET.SubElement(nav_list, "li"), "a")
    link.set("href", os.path.relpath(document.source_path, document.content_dir))
    link.text = document.tree.find(".//title").text

    for child in sorted(
        document.children,
        key=lambda d: d.tree.find(".//title").text if d.tree is not None else None,
    ):
        if child.tree is None:
            continue

        link = ET.SubElement(ET.SubElement(nav_list, "li"), "a")
        link.set("href", os.path.relpath(child.source_path, document.content_dir))
        link.text = child.tree.find(".//title").text

    with open(pickle_path, "wb") as f:
        pickle.dump(header, f)
else:
    with open(pickle_path, "rb") as f:
        header = pickle.load(f, encoding="UTF-8")

for link in header.findall(".//a"):
    if not os.path.relpath(
        os.path.join(document.content_dir, link.get("href")), document.source_path
    ).startswith(".." + os.path.sep):
        link.set("class", link.get("class", "") + " active")

body: ET.Element = document.tree.find(".//body")

body.insert(0, header)
