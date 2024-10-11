from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

UNFOLD_SETTINGS = {
    "STYLES": [
        lambda request: static("custom_admin.css"),
    ],
    "COLORS": {
        "font": {
            "subtle-light": "120 120 120",  # Light: Neutral grey for subtler text
            "subtle-dark": "180 180 180",   # Dark: Slightly brighter grey for readability
            "default-light": "33 37 41",    # Light: Darker grey, close to black
            "default-dark": "220 220 220",  # Dark: Light grey to contrast well against dark backgrounds
            "important-light": "0 0 0",     # Light: Black for maximum contrast
            "important-dark": "255 255 255", # Dark: White for maximum contrast
            "input-light": "0 0 0",         # Light: Black for maximum contrast
            "input-dark": "255 255 255"     # Dark: White for maximum contrast
        },
        "primary": {
            # Set the primary color to rgb(5, 124, 77)
            "50": "5 124 77",   # Lightest shade
            "100": "5 124 77",  # Very light shade
            "200": "5 124 77",  # Light shade
            "300": "5 124 77",  # Brighter shade
            "400": "5 124 77",  # Moderate shade
            "500": "5 124 77",  # Strong shade
            "600": "5 124 77",  # Deeper shade
            "700": "5 124 77",  # Darker shade
            "800": "5 124 77",  # Dark shade
            "900": "5 124 77",  # Very dark shade
            "950": "5 124 77",  # Almost black shade
        },
    },
    "SITE_HEADER": "Admin Page",
    "SITE_TITLE": "Admin Papge",
    "SIDEBAR": {
        "show_search": True,  # Search in applications and models names
        "show_all_applications": False,  # Dropdown with all applications and models
        "navigation": [
            {
                "title": _("Users"),
                "separator": True,  # Top border
                "collapsible": True,  # Collapsible group of links
                "items": [
                    {
                        "title": _("Users"),
                        "link": reverse_lazy("admin:user_user_changelist"),
                        "icon": "people",
                    },
                    {
                        "title": _("Social Accounts"),
                        "link": reverse_lazy("admin:social_django_usersocialauth_changelist"),
                        "icon": "account_circle",
                    },
                    {
                        "title": _("Tutor Profiles"),
                        "link": reverse_lazy("admin:profiles_tutorprofile_changelist"),
                        "icon": "person",
                    },
                    {
                        "title": _("Password Reset Tokens"),
                        "link": reverse_lazy("admin:user_passwordresettoken_changelist"),
                        "icon": "vpn_key",
                    }
                ],
            },
            {
                "title": _("Courses"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Faculties"),
                        "link": reverse_lazy("admin:courses_faculty_changelist"),
                        "icon": "school",
                    },
                    {
                        "title": _("Courses"),
                        "link": reverse_lazy("admin:courses_course_changelist"),
                        "icon": "class",
                    },
                    {
                        "title": _("Course Tutors"),
                        "link": reverse_lazy("admin:courses_coursetutors_changelist"),
                        "icon": "person",
                    },
                    {
                        "title": _("Tutor Try Outs"),
                        "link": reverse_lazy("admin:courses_tutortryouts_changelist"),
                        "icon": "person",
                    },
                ],
            },
            {
                "title": _("Posts"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Request Help Posts"),
                        "link": reverse_lazy("admin:posts_requesthelppost_changelist"),
                        "icon": "help",
                    },
                    {
                        "title": _("Offer Help Posts"),
                        "link": reverse_lazy("admin:posts_offerhelppost_changelist"),
                        "icon": "help",
                    },
                    {
                        "title": _("Comments"),
                        "link": reverse_lazy("admin:posts_comment_changelist"),
                        "icon": "comment",
                    },
                ],
            },
            {
                "title": _("Tutoring Sessions"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Sessions"),
                        "link": reverse_lazy("admin:tutoring_sessions_session_changelist"),
                        "icon": "live_help",
                    }
                ],
            }
        ],
    },
}