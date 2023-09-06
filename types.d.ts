type CountryB = {
    "id": string,
    "userId": string,
    "country": string,
    "flag": string,
    }
type Country = {
    "id": string,
    "userId": string,
    "country": string,
    "flag": string,
    "banks": {
        "name": string,
        "logo": string,
        "payment": {
            "type": string,
            "symbol": string,
            "limits": string,
            "information": string,
            "steps": {
                "st1_pic": string,
                "st1_text": string,
                "st2_pic": string,
                "st2_text": string,
                "st3_pic": string,
                "st3_text": string,
                "st4_pic": string,
                "st4_text": string,
                "st5_pic": string,
                "st5_text": string,
                "st6_pic": string,
                "st6_text": string
          }
        },
      }
    }