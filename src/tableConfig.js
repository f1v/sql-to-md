export default {
  column_list: {
    description: `This entity is how we configure what columns are displayed in tables that are driven by ElascticSearch.
    It is important to note the ColumnLists are not user configurable and are only used by the developers.
    Users can configurable what columns they see in a table via the ShowHideColumns modal on the front end which allows them to create a CustomView`,
    purpose:
      'This entity represents what columns a table will display (e.g. ContentBrowserTable)',
  },
};
