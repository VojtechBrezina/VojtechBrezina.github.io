# pylint: disable=E0602
"""
Generate a navbar from the top level files and directories and a list of child
pages.
"""

import os
import pickle
import xml.etree.ElementTree as ET


def sync_lang(element, document):
    if "lang" in document.metadata:
        element.set("lang", document.metadata["lang"])


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

        item = ET.SubElement(nav_list, "li")
        link = ET.SubElement(item, "a")
        link.set("href", os.path.relpath(child.source_path, document.content_dir))
        link.text = child.tree.find(".//title").text
        sync_lang(item, child)

    with open(pickle_path, "wb") as f:
        pickle.dump(header, f)
else:
    with open(pickle_path, "rb") as f:
        header = pickle.load(f, encoding="UTF-8")

for link in header.findall(".//a"):
    document_path = os.path.relpath(document.source_path, document.content_dir)
    link_path = os.path.relpath(
        os.path.join(document.content_dir, link.get("href")),
        document.content_dir,
    )
    link_dir = os.path.relpath(
        os.path.dirname(
            os.path.join(document.content_dir, link.get("href")),
        ),
        document.content_dir,
    )

    if document_path.startswith(link_dir) or (
        link_dir == "." and document_path == link_path
    ):
        link.set("class", link.get("class", "") + " active")

body: ET.Element = document.tree.find(".//body")

body.insert(0, header)

child_nav = document.tree.find(".//nav[@data-children]")
if child_nav is None:
    child_nav = ET.Element("nav")
    document.tree.find(".//main").insert(0, child_nav)
else:
    child_nav.attrib.pop("data-children")
child_nav_list = ET.SubElement(child_nav, "ul")

if document.parent is not None:
    container = ET.Element("ol", {"class": "breadcrumbs"})
    document.tree.find(".//main").insert(0, container)

    parent = document.parent
    while parent is not None:
        item = ET.Element("li")
        sync_lang(item, parent)

        container.insert(0, item)

        link = ET.SubElement(item, "a")
        link.set(
            "href",
            os.path.relpath(parent.source_path, document.content_dir),
        )
        link.text = "".join(parent.tree.find(".//title").itertext())

        parent = parent.parent

    item = ET.SubElement(container, "li")
    item.text = "".join(document.tree.find(".//title").itertext())
    sync_lang(item, document)

for child in sorted(
    document.children,
    key=lambda d: d.tree.find(".//title").text if d.tree is not None else None,
):
    if child.tree is None:
        continue

    item = ET.SubElement(child_nav_list, "li")
    sync_lang(item, child)

    link = ET.SubElement(item, "a")
    link.set("href", os.path.relpath(child.source_path, document.content_dir))
    link.text = child.tree.find(".//title").text
    if "lang" in child.metadata:
        link.set("lang", child.metadata["lang"])

    description_element = child.tree.find('.//meta[@name="description"]')

    if description_element is not None and "content" in description_element.attrib:
        link.tail = f" \u2013 {description_element.get('content')}"
