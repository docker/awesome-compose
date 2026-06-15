# -*- coding: utf-8 -*-

from odoo import fields, models

class ResPartner(models.Model):
    _inherit = 'res.partner'

    birthday_date = fields.Date(
        string="Birthday", help="Contact's birthday date")
