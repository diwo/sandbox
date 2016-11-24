#!/bin/bash

# SEARCH_HOST=
# DB_HOST=
# DB_NAME=

FIRST_NAME=$1
LAST_NAME=$2
EMAIL=$3

# QUERY="+(firstName:$FIRST_NAME*) +(lastName:$LAST_NAME*) +(emailExact:$EMAIL*)"
QUERY="+(firstNameExact:$FIRST_NAME*) +(lastNameExact:$LAST_NAME*) +(emailExact:$EMAIL*)"
echo "Query: $QUERY"

XML=$(curl -sG "http://$SEARCH_HOST/search/customer/select" \
  --data-urlencode "qt=standard" \
  --data-urlencode "q=$QUERY")

FOUND=$(xmllint --xpath "string(//result/@numFound)" - <<< "$XML")
echo "Found: $FOUND"

if [ "$?" -ne 0 -o "$FOUND" -le 0 ]; then
  exit
fi

CUST_UIDS=$(xmllint --xpath "//doc/long[@name='objectUid']" - <<< "$XML" \
  | sed -e 's|><|>\n<|g' -e 's|"|\\"|g' \
  | xargs -I {} bash -c "xmllint --xpath '/long/text()' - <<< '{}'; echo")

CUST_UIDS_LIST=$(paste -sd ',' - <<< "$CUST_UIDS")
echo "Customer UIDs: $CUST_UIDS_LIST"

docker run --rm -it mysql:5.6 mysql --default-character-set=utf8 -h $DB_HOST $DB_NAME \
  -e "select c.uidpk, c.user_id, cpv.LOCALIZED_ATTRIBUTE_KEY, cpv.SHORT_TEXT_VALUE \
      from TCUSTOMER c, TCUSTOMERPROFILEVALUE cpv \
      where c.uidpk = cpv.customer_uid \
      and c.uidpk in ($CUST_UIDS_LIST) \
      and cpv.LOCALIZED_ATTRIBUTE_KEY in ('CP_EMAIL', 'CP_FIRST_NAME', 'CP_LAST_NAME');"

