const splashPNG = "data:image/png;base64,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";