# CSS Minification Script
# Removes comments, newlines, and extra whitespace from CSS files

$files = @(
    "c:\websites\Melba\main\assets\css\style.css",
    "c:\websites\Melba\public\assets\css\style.css"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Minifying: $file"
        
        # Read the CSS file
        $content = Get-Content $file -Raw
        
        # Remove comments
        $content = $content -replace '/\*[\s\S]*?\*/', ''
        
        # Remove newlines and extra spaces
        $content = $content -replace '\s+', ' '
        
        # Remove spaces around special characters
        $content = $content -replace '\s*([{}:;,>+~])\s*', '$1'
        
        # Trim leading/trailing whitespace
        $content = $content.Trim()
        
        # Save minified version
        $minPath = $file -replace '\.css$', '.min.css'
        Set-Content -Path $minPath -Value $content -Encoding UTF8
        
        Write-Host "Created: $minPath"
        
        $origSize = (Get-Item $file).Length
        $minSize = (Get-Item $minPath).Length
        $savings = [math]::Round(((($origSize - $minSize) / $origSize) * 100), 2)
        Write-Host "Size reduction: $origSize bytes → $minSize bytes ($savings% smaller)"
        Write-Host ""
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "CSS minification complete!"
