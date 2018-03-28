resource "aws_cloudfront_distribution" "website" {
  enabled = true

  default_root_object = "index.html"
  aliases = ["doihavethebmlt.org", "www.doihavethebmlt.org"]

  origin {
    origin_id   = "origin-bucket-${aws_s3_bucket.website.id}"
    domain_name = "${aws_s3_bucket.website.website_endpoint}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "DELETE", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true

    "forwarded_values" {
      "cookies" {
        forward = "all"
      }

      query_string = false
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    target_origin_id       = "origin-bucket-${aws_s3_bucket.website.id}"
    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:289519887773:certificate/14e146c2-64db-4a1b-bcce-06a73351f3ba"
    ssl_support_method  = "sni-only"
  }

  restrictions {
    "geo_restriction" {
      restriction_type = "none"
    }
  }
}
