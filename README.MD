# S3 bucket custom policy
"S3BucketPolicy": {
    "DependsOn": [
        "S3Bucket"
    ],
    "Type" : "AWS::S3::BucketPolicy",
    "Properties" : {
        "Bucket" : {"Ref" : "S3Bucket"},
        "PolicyDocument": {
            "Statement":[{
                "Sid": "PublidReadGetObject",
                "Effect": "Allow",
                "Action": "s3:GetObject",
                "Principal": "*",
                "Resource": [
                    {
                        "Fn::Join": [
                            "",
                            [
                                "arn:aws:s3:::",
                                {
                                    "Ref": "S3Bucket"
                                },
                                "/public/*"
                            ]
                        ]
                    }
                ]
            }]
        }
    }
}

# ################################################ #