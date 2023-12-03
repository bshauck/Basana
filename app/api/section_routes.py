from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Section, db
from app.forms import SectionForm, error_message, error_messages

section_routes = Blueprint('sections', __name__)

@section_routes.route('')
@login_required
def get_all_sections():
    """
    Query for all Sections and returns them in a list of dictionaries
    """
    print("DB: about to get all sections")
    sections = Section.query.all()
    print("DB: sections", sections)
    return {"sections": [section.to_dict() for section in sections]}


@section_routes.route('/<int:id>')
@login_required
def get_section(id):
    """
    Query for a section by id and returns that section in a dictionary
    """
    section = Section.query.get(id)
    return section.to_dict()


@section_routes.route('/new', methods=["POST"])
@login_required
def create_section():
    """
    Creates a new section and returns the new section in a dictionary
    """

    form = SectionForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_section = {
            "owner": current_user.id,
            "name": form.name.data,
        }

        section = section(**new_section)
        db.session.add(section)
        db.session.commit()
        return section.to_dict(), 201
    elif form.errors:
        return error_messages(form.errors), 401
    else:
        return error_message("unknown", "An unknown Error has occurred"), 500

@section_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_section(id):
    """
    Updates a section and rturns the updated section in a ictionary
    """

    section = Section.query.get(id)

    form = SectionForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        section.name = form.name.data
        db.session.add(section)
        db.session.commit()
        return section.to_dit(), 201
    elif form.errors:
        return error_messages(form.errors), 401
    else:
        return error_message("unknown", "An unknown Error has occurred"), 500

@section_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_section(id):
    """
    Deletes an section and returns a message if successfully deleted
    """
    section = Section.query.get(id)

    if section.owner != current_user.id:
        return error_message("user", "Authorization Error"), 403

    db.session.delete(section)
    db.session.commit()
    return {"message": "section successfully deleted"}
