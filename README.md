# WP Data Access client - free edition

This code requires a WordPress installation with WP Data Access installed and activated.

WP Data Access can be downloaded from here:
https://wordpress.org/plugins/wp-data-access/

## Setup

- Clone repository
- Run `npm i`

## Run

- Run `npm run dev`
- To access the Table and Form Builder for a specific database table, enable anonymous REST API access for the database table in the Data Explorer, replace your-database-name and your-table-name in the HTML with the correct database and table name and update variable urlRoot to reflect your domain. Please be aware that anonymous REST API access allows other anonymous users to access your database table through the REST API as well. Use anonymous REST API access with care for development purposes only. Do not enable anonymous insert, update or delete transactions on production servers.
- It is not possible to access the Data Explorer from the provided HTML page. Accessing the Data Explorer requires an active WordPress admin login and is only supported from the WordPress dashboard and front-end.

## Build

- Run `npm run build`
- Copy build folder to plugin folder:\
  WordPress-Home/wp-content/plugins/wp-data-access/assets/dist

## Notes

- This repository is auto-generated from the premium WP Data Access client code and licensed under GNU GENERAL PUBLIC LICENSE.
- Premium features were removed during the generation process. As s result this repository contains some unsed premium code.
- We do not offer development support for custom builds.
- Use at your own risk.

## Useful links

- [Download WP Data Access](https://wordpress.org/plugins/wp-data-access/)
- [WP Data Access Website](https://wpdataaccess.com/)
- [WP Data Access Documentation](https://wpdataaccess.com/documentation/)
- [WP Data Access Demos](https://wpdataaccess.com/demos/)
- [WP Data Access Tutorials](https://wpdataaccess.com/tutorials/)
