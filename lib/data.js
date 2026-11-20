const COVERS = {"codm":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJjb2RtIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMyMzIzMjMiLz4KPHJlY3QgeD0iMjMwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjU5RTBCIiBvcGFjaXR5PSIwLjM1Ii8+PHJlY3QgeD0iMjY4IiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjU5RTBCIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzMDYiIHk9IjAiIHdpZHRoPSIyMiIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNGNTlFMEIiIG9wYWNpdHk9IjAuNjQ5OTk5OTk5OTk5OTk5OSIvPjxyZWN0IHg9IjM0NCIgeT0iMCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Y1OUUwQiIgb3BhY2l0eT0iMC43OTk5OTk5OTk5OTk5OTk5Ii8+Cjx0ZXh0IHg9IjI4IiB5PSIzNzIiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCdBcmlhbCBCbGFjaycsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIxNTAiIGxldHRlci1zcGFjaW5nPSItOCIgZmlsbD0iI0ZGRkZGRiI+Q29EPC90ZXh0Pgo8L3N2Zz4=","freefire":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJmcmVlZmlyZSI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjI2QjFEIi8+CjxyZWN0IHg9IjIzMCIgeT0iMCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGRDlBOCIgb3BhY2l0eT0iMC4zNSIvPjxyZWN0IHg9IjI2OCIgeT0iMCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGRDlBOCIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMzA2IiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjUwIiBmaWxsPSIjRkZEOUE4IiBvcGFjaXR5PSIwLjY0OTk5OTk5OTk5OTk5OTkiLz48cmVjdCB4PSIzNDQiIHk9IjAiIHdpZHRoPSIyMiIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGRkQ5QTgiIG9wYWNpdHk9IjAuNzk5OTk5OTk5OTk5OTk5OSIvPgo8dGV4dCB4PSIyOCIgeT0iMzcyIiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywnQXJpYWwgQmxhY2snLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iMjEwIiBsZXR0ZXItc3BhY2luZz0iLTgiIGZpbGw9IiMxNzE0MEYiPkZGPC90ZXh0Pgo8L3N2Zz4=","genshin":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJnZW5zaGluIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiM0QTg2RDgiLz4KPHJlY3QgeD0iMjUwIiB5PSItMTAiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSAzMjUgNjUpIiBmaWxsPSIjRkZFOUE4IiBvcGFjaXR5PSIuODUiLz4KPHRleHQgeD0iMjgiIHk9IjM3MiIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsJ0FyaWFsIEJsYWNrJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9IjIxMCIgbGV0dGVyLXNwYWNpbmc9Ii04IiBmaWxsPSIjRkZGRkZGIj5HSTwvdGV4dD4KPC9zdmc+","hok":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJob2siPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzBFOEFBOCIvPgo8Y2lyY2xlIGN4PSIzMzAiIGN5PSI3MCIgcj0iMTIwIiBmaWxsPSIjRjZEMzY1IiBvcGFjaXR5PSIuOSIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzgwIiByPSI2MCIgZmlsbD0iI0Y2RDM2NSIgb3BhY2l0eT0iLjQ1Ii8+Cjx0ZXh0IHg9IjI4IiB5PSIzNzIiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCdBcmlhbCBCbGFjaycsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIxNTAiIGxldHRlci1zcGFjaW5nPSItOCIgZmlsbD0iI0ZGRkZGRiI+SG9LPC90ZXh0Pgo8L3N2Zz4=","mlbb":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJtbGJiIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxRjRGRDgiLz4KPGNpcmNsZSBjeD0iMzMwIiBjeT0iNzAiIHI9IjEyMCIgZmlsbD0iI0ZGQzg1NyIgb3BhY2l0eT0iLjkiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjM4MCIgcj0iNjAiIGZpbGw9IiNGRkM4NTciIG9wYWNpdHk9Ii40NSIvPgo8dGV4dCB4PSIyOCIgeT0iMzcyIiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywnQXJpYWwgQmxhY2snLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iMjEwIiBsZXR0ZXItc3BhY2luZz0iLTgiIGZpbGw9IiNGRkZGRkYiPk1MPC90ZXh0Pgo8L3N2Zz4=","pointblank":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJwb2ludGJsYW5rIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNCODdBMUUiLz4KPHBvbHlnb24gcG9pbnRzPSIyMDAsMCAyNTAsMCAxNTAsNDAwIDEwMCw0MDAiIGZpbGw9IiNGREUzQTciIG9wYWNpdHk9IjAuMjUiLz48cG9seWdvbiBwb2ludHM9IjI3MCwwIDMyMCwwIDIyMCw0MDAgMTcwLDQwMCIgZmlsbD0iI0ZERTNBNyIgb3BhY2l0eT0iMC40NSIvPjxwb2x5Z29uIHBvaW50cz0iMzQwLDAgMzkwLDAgMjkwLDQwMCAyNDAsNDAwIiBmaWxsPSIjRkRFM0E3IiBvcGFjaXR5PSIwLjY1Ii8+Cjx0ZXh0IHg9IjI4IiB5PSIzNzIiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCdBcmlhbCBCbGFjaycsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIyMTAiIGxldHRlci1zcGFjaW5nPSItOCIgZmlsbD0iIzFDMTIwNiI+UEI8L3RleHQ+Cjwvc3ZnPg==","pubgm":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJwdWJnbSI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRDlCNTNBIi8+CjxyZWN0IHg9IjIzMCIgeT0iMjQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNGNkU3QTYiIG9wYWNpdHk9IjAuMjUiLz48cmVjdCB4PSIyNzAiIHk9IjI0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRjZFN0E2IiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzMTAiIHk9IjI0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRjZFN0E2IiBvcGFjaXR5PSIwLjc1Ii8+PHJlY3QgeD0iMzUwIiB5PSIyNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0Y2RTdBNiIgb3BhY2l0eT0iMC4yNSIvPjxyZWN0IHg9IjIzMCIgeT0iNjQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNGNkU3QTYiIG9wYWNpdHk9IjAuNSIvPjxyZWN0IHg9IjI3MCIgeT0iNjQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNGNkU3QTYiIG9wYWNpdHk9IjAuNzUiLz48cmVjdCB4PSIzMTAiIHk9IjY0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRjZFN0E2IiBvcGFjaXR5PSIwLjI1Ii8+PHJlY3QgeD0iMzUwIiB5PSI2NCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0Y2RTdBNiIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMjMwIiB5PSIxMDQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNGNkU3QTYiIG9wYWNpdHk9IjAuNzUiLz48cmVjdCB4PSIyNzAiIHk9IjEwNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0Y2RTdBNiIgb3BhY2l0eT0iMC4yNSIvPjxyZWN0IHg9IjMxMCIgeT0iMTA0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRjZFN0E2IiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzNTAiIHk9IjEwNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0Y2RTdBNiIgb3BhY2l0eT0iMC43NSIvPjxyZWN0IHg9IjIzMCIgeT0iMTQ0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRjZFN0E2IiBvcGFjaXR5PSIwLjI1Ii8+PHJlY3QgeD0iMjcwIiB5PSIxNDQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNGNkU3QTYiIG9wYWNpdHk9IjAuNSIvPjxyZWN0IHg9IjMxMCIgeT0iMTQ0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRjZFN0E2IiBvcGFjaXR5PSIwLjc1Ii8+PHJlY3QgeD0iMzUwIiB5PSIxNDQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNGNkU3QTYiIG9wYWNpdHk9IjAuMjUiLz4KPHRleHQgeD0iMjgiIHk9IjM3MiIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsJ0FyaWFsIEJsYWNrJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9IjIxMCIgbGV0dGVyLXNwYWNpbmc9Ii04IiBmaWxsPSIjMUQyQTEyIj5QTTwvdGV4dD4KPC9zdmc+","roblox":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJyb2Jsb3giPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJCMzM0MCIvPgo8cmVjdCB4PSIyMzAiIHk9IjI0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRUY0NDQ0IiBvcGFjaXR5PSIwLjI1Ii8+PHJlY3QgeD0iMjcwIiB5PSIyNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0VGNDQ0NCIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMzEwIiB5PSIyNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0VGNDQ0NCIgb3BhY2l0eT0iMC43NSIvPjxyZWN0IHg9IjM1MCIgeT0iMjQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNFRjQ0NDQiIG9wYWNpdHk9IjAuMjUiLz48cmVjdCB4PSIyMzAiIHk9IjY0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRUY0NDQ0IiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIyNzAiIHk9IjY0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRUY0NDQ0IiBvcGFjaXR5PSIwLjc1Ii8+PHJlY3QgeD0iMzEwIiB5PSI2NCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0VGNDQ0NCIgb3BhY2l0eT0iMC4yNSIvPjxyZWN0IHg9IjM1MCIgeT0iNjQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNFRjQ0NDQiIG9wYWNpdHk9IjAuNSIvPjxyZWN0IHg9IjIzMCIgeT0iMTA0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRUY0NDQ0IiBvcGFjaXR5PSIwLjc1Ii8+PHJlY3QgeD0iMjcwIiB5PSIxMDQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNFRjQ0NDQiIG9wYWNpdHk9IjAuMjUiLz48cmVjdCB4PSIzMTAiIHk9IjEwNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0VGNDQ0NCIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMzUwIiB5PSIxMDQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjYiIGZpbGw9IiNFRjQ0NDQiIG9wYWNpdHk9IjAuNzUiLz48cmVjdCB4PSIyMzAiIHk9IjE0NCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0VGNDQ0NCIgb3BhY2l0eT0iMC4yNSIvPjxyZWN0IHg9IjI3MCIgeT0iMTQ0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRUY0NDQ0IiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzMTAiIHk9IjE0NCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iNiIgZmlsbD0iI0VGNDQ0NCIgb3BhY2l0eT0iMC43NSIvPjxyZWN0IHg9IjM1MCIgeT0iMTQ0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI2IiBmaWxsPSIjRUY0NDQ0IiBvcGFjaXR5PSIwLjI1Ii8+Cjx0ZXh0IHg9IjI4IiB5PSIzNzIiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCdBcmlhbCBCbGFjaycsQXJpYWwsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIyMTAiIGxldHRlci1zcGFjaW5nPSItOCIgZmlsbD0iI0ZGRkZGRiI+UkI8L3RleHQ+Cjwvc3ZnPg==","steam":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJzdGVhbSI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMTIzQTVFIi8+CjxjaXJjbGUgY3g9IjMzMCIgY3k9IjcwIiByPSIxMjAiIGZpbGw9IiM3REQzRkMiIG9wYWNpdHk9Ii45Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSIzODAiIHI9IjYwIiBmaWxsPSIjN0REM0ZDIiBvcGFjaXR5PSIuNDUiLz4KPHRleHQgeD0iMjgiIHk9IjM3MiIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsJ0FyaWFsIEJsYWNrJyxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9IjIxMCIgbGV0dGVyLXNwYWNpbmc9Ii04IiBmaWxsPSIjRkZGRkZGIj5TPC90ZXh0Pgo8L3N2Zz4=","valorant":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJ2YWxvcmFudCI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRTUzODRDIi8+Cjxwb2x5Z29uIHBvaW50cz0iMjAwLDAgMjUwLDAgMTUwLDQwMCAxMDAsNDAwIiBmaWxsPSIjRkZDMkNBIiBvcGFjaXR5PSIwLjI1Ii8+PHBvbHlnb24gcG9pbnRzPSIyNzAsMCAzMjAsMCAyMjAsNDAwIDE3MCw0MDAiIGZpbGw9IiNGRkMyQ0EiIG9wYWNpdHk9IjAuNDUiLz48cG9seWdvbiBwb2ludHM9IjM0MCwwIDM5MCwwIDI5MCw0MDAgMjQwLDQwMCIgZmlsbD0iI0ZGQzJDQSIgb3BhY2l0eT0iMC42NSIvPgo8dGV4dCB4PSIyOCIgeT0iMzcyIiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywnQXJpYWwgQmxhY2snLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iMjEwIiBsZXR0ZXItc3BhY2luZz0iLTgiIGZpbGw9IiMxNDA4MEEiPlY8L3RleHQ+Cjwvc3ZnPg=="};


/* Zenvira Digital — Data katalog (game, PPOB, pembayaran, promo, FAQ, status)
   Diekstrak dari V1 (logika sudah teruji). Dimuat sebagai <script> klasik: scope top-level dipakai bersama. */
/* Identitas & kontak situs — ubah di sini, tampil otomatis di footer/halaman Kontak.
   Biarkan string kosong ('') untuk menyembunyikan baris terkait. */
const SITE = {
  name: 'Zenvira Digital',
  email: 'halo@zenviradigital.id',
  whatsapp: '',
  hours: 'Setiap hari, 08.00–22.00 WIB',
};

const CONFIG = {
  locale: 'id-ID',
};

const rows = (prefix, list) => list.map(([label, price, tag], i) => ({ id: `${prefix}-${i + 1}`, label, price, tag }));
const nominal = (n) => 'Rp' + n.toLocaleString('id-ID');

const FIELD_PHONE = { id: 'phone', label: 'Nomor HP', ph: '08123456789', inputmode: 'tel', maxlength: 14, rule: { type: 'phone' }, detect: true, hint: 'Contoh: 08123456789' };

const GAMES = [
  {
    id: 'mlbb', kind: 'game', name: 'Mobile Legends: Bang Bang', short: 'Mobile Legends', aliases: ['mlbb', 'ml'], category: 'MOBA', currency: 'Diamonds', popular: true, rank: 1,
    layout: 'split', fields: [
      { id: 'userId', label: 'User ID', ph: 'Contoh: 12345678', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 7, max: 12 }, hint: 'Lihat di profil game.' },
      { id: 'zoneId', label: 'Zone ID', ph: '1234', inputmode: 'numeric', maxlength: 5, rule: { type: 'digits', min: 3, max: 5 }, hint: 'Angka dalam kurung.' },
    ],
    products: rows('mlbb', [['3 Diamonds', 1000], ['12 Diamonds', 3500], ['28 Diamonds', 7500], ['59 Diamonds', 15000, 'Populer'], ['86 Diamonds', 21500, 'Terlaris'], ['172 Diamonds', 42500], ['257 Diamonds', 63000], ['706 Diamonds', 172000], ['Weekly Diamond Pass', 27500, 'Hemat']]),
  },
  {
    id: 'freefire', kind: 'game', name: 'Free Fire', short: 'Free Fire', aliases: ['ff'], category: 'Battle Royale', currency: 'Diamonds', popular: true, rank: 2,
    fields: [{ id: 'userId', label: 'Player ID', ph: 'Contoh: 123456789', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 8, max: 12 }, hint: 'Ada di profil / lobi game.' }],
    products: rows('freefire', [['5 Diamonds', 1000], ['50 Diamonds', 7500], ['70 Diamonds', 10000], ['140 Diamonds', 19500, 'Populer'], ['355 Diamonds', 48500], ['720 Diamonds', 96000], ['1450 Diamonds', 190000], ['Membership Mingguan', 29000, 'Hemat']]),
  },
  {
    id: 'pubgm', kind: 'game', name: 'PUBG Mobile', short: 'PUBG Mobile', aliases: ['pubg', 'pubgm'], category: 'Battle Royale', currency: 'UC', popular: true, rank: 3,
    fields: [{ id: 'userId', label: 'Character ID', ph: 'Contoh: 5123456789', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 8, max: 12 }, hint: 'Ketuk avatar di game untuk melihat ID.' }],
    products: rows('pubgm', [['60 UC', 15000], ['325 UC', 78000], ['660 UC', 155000, 'Populer'], ['1800 UC', 400000], ['3850 UC', 800000], ['8100 UC', 1600000]]),
  },
  {
    id: 'genshin', kind: 'game', name: 'Genshin Impact', short: 'Genshin Impact', aliases: ['gi', 'genshin'], category: 'RPG', currency: 'Genesis Crystals', popular: true, rank: 4,
    layout: 'split', fields: [
      { id: 'uid', label: 'UID', ph: '8xxxxxxxx', inputmode: 'numeric', maxlength: 10, rule: { type: 'digits', min: 9, max: 10 }, hint: '9–10 digit, ada di pojok layar.' },
      { id: 'server', label: 'Server', type: 'select', options: ['Asia', 'America', 'Europe', 'TW/HK/MO'] },
    ],
    products: rows('genshin', [['60 Genesis Crystals', 16000], ['300 + 30 Genesis Crystals', 79000], ['980 + 110 Genesis Crystals', 249000, 'Populer'], ['1980 + 260 Genesis Crystals', 479000], ['3280 + 600 Genesis Crystals', 799000], ['6480 + 1600 Genesis Crystals', 1599000], ['Blessing of the Welkin Moon', 79000, 'Hemat']]),
  },
  {
    id: 'valorant', kind: 'game', name: 'Valorant', short: 'Valorant', aliases: ['valo', 'vp'], category: 'FPS', currency: 'Valorant Points', popular: true, rank: 5,
    fields: [{ id: 'riotId', label: 'Riot ID', ph: 'NamaKamu#TAG', maxlength: 24, rule: { type: 'regex', re: /^.{3,16}#[A-Za-z0-9]{3,5}$/, msg: 'Format Riot ID: Nama#TAG (contoh: Jett#123).' }, hint: 'Format: Nama#TAG' }],
    products: rows('valorant', [['475 VP', 59000], ['1000 VP', 119000, 'Populer'], ['2050 VP', 239000], ['3650 VP', 419000], ['5350 VP', 599000], ['11000 VP', 1190000]]),
  },
  {
    id: 'hok', kind: 'game', name: 'Honor of Kings', short: 'Honor of Kings', aliases: ['hok'], category: 'MOBA', currency: 'Tokens', popular: true, rank: 6,
    fields: [{ id: 'userId', label: 'User ID', ph: 'Contoh: 12345678', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 8, max: 12 }, hint: 'Ada di menu profil.' }],
    products: rows('hok', [['16 Tokens', 3000], ['80 Tokens', 15000], ['240 Tokens', 45000, 'Populer'], ['400 Tokens', 75000], ['800 Tokens', 149000], ['1200 Tokens', 220000]]),
  },
  {
    id: 'roblox', kind: 'game', name: 'Roblox', short: 'Roblox', aliases: ['rbx', 'robux'], category: 'Sandbox', currency: 'Robux', popular: true, rank: 7,
    fields: [{ id: 'username', label: 'Username Roblox', ph: 'username_kamu', maxlength: 20, rule: { type: 'regex', re: /^[A-Za-z0-9_]{3,20}$/, msg: 'Username 3–20 karakter: huruf, angka, atau underscore.' }, hint: '3–20 karakter.' }],
    products: rows('roblox', [['80 Robux', 15000], ['400 Robux', 75000, 'Populer'], ['800 Robux', 150000], ['1700 Robux', 300000], ['4500 Robux', 750000]]),
  },
  {
    id: 'codm', kind: 'game', name: 'Call of Duty Mobile', short: 'CoD Mobile', aliases: ['cod', 'codm'], category: 'FPS', currency: 'CP', popular: false, rank: 8,
    fields: [{ id: 'openId', label: 'Open ID', ph: 'Contoh: 6789012345678', inputmode: 'numeric', maxlength: 20, rule: { type: 'digits', min: 8, max: 20 }, hint: 'Ada di menu pengaturan akun.' }],
    products: rows('codm', [['63 CP', 10000], ['128 CP', 20000], ['321 CP', 49000, 'Populer'], ['645 CP', 98000], ['1373 CP', 199000], ['2750 CP', 395000]]),
  },
  {
    id: 'steam', kind: 'game', name: 'Steam Wallet', short: 'Steam Wallet', aliases: ['steam'], category: 'Voucher', currency: 'Steam Wallet Code', popular: false, rank: 9,
    fields: [{ id: 'email', label: 'Email Penerima Kode', ph: 'nama@email.com', type: 'email', inputmode: 'email', maxlength: 60, rule: { type: 'email' }, hint: 'Kode voucher dikirim ke email ini.' }],
    products: rows('steam', [['Steam Wallet Rp12.000', 12400], ['Steam Wallet Rp45.000', 46400], ['Steam Wallet Rp60.000', 61800], ['Steam Wallet Rp90.000', 92700, 'Populer'], ['Steam Wallet Rp120.000', 123600], ['Steam Wallet Rp250.000', 257500], ['Steam Wallet Rp400.000', 412000]]),
  },
  {
    id: 'pointblank', kind: 'game', name: 'Point Blank', short: 'Point Blank', aliases: ['pb'], category: 'FPS', currency: 'PB Cash', popular: false, rank: 10,
    fields: [{ id: 'userId', label: 'ID Zepetto', ph: 'id_zepetto', maxlength: 20, rule: { type: 'regex', re: /^[A-Za-z0-9_]{4,20}$/, msg: 'ID 4–20 karakter: huruf, angka, atau underscore.' }, hint: '4–20 karakter.' }],
    products: rows('pointblank', [['1.200 PB Cash', 10000], ['2.400 PB Cash', 20000], ['6.000 PB Cash', 50000, 'Populer'], ['12.000 PB Cash', 100000], ['24.000 PB Cash', 200000], ['60.000 PB Cash', 500000]]),
  },
].map((g) => ({ ...g, cover: COVERS[g.id], subtitle: `${g.category} · ${g.currency}`, icon: 'fa-gem', stepTitle: 'Data Akun' }));

const pulsaPrice = (n) => n + (n <= 10000 ? 1000 : 1500);
const PPOB = [
  { id: 'pulsa', kind: 'ppob', name: 'Pulsa Semua Operator', short: 'Pulsa', icon: 'fa-mobile-screen-button', tone: 'blue', desc: 'Isi ulang pulsa semua operator, proses cepat.', stepTitle: 'Nomor Tujuan', fields: [FIELD_PHONE],
    products: rows('pulsa', [5000, 10000, 15000, 20000, 25000, 50000, 100000].map((n) => [`Pulsa ${nominal(n)}`, pulsaPrice(n), n === 50000 ? 'Populer' : undefined])) },
  { id: 'data', kind: 'ppob', name: 'Paket Data Internet', short: 'Paket Data', icon: 'fa-wifi', tone: 'cyan', desc: 'Kuota harian hingga bulanan, semua operator.', stepTitle: 'Nomor Tujuan', fields: [FIELD_PHONE],
    products: rows('data', [['1,5 GB · 7 hari', 15000], ['3 GB · 30 hari', 28000], ['8 GB · 30 hari', 45000, 'Populer'], ['15 GB · 30 hari', 65000], ['30 GB · 30 hari', 95000], ['70 GB · 30 hari', 150000]]) },
  { id: 'pln', kind: 'ppob', name: 'Token Listrik PLN', short: 'Token PLN', icon: 'fa-bolt', tone: 'orange', desc: 'Beli token prabayar, kode token langsung tampil.', stepTitle: 'Nomor Meter', fields: [{ id: 'meter', label: 'Nomor Meter / ID Pelanggan', ph: '12345678901', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 11, max: 12 }, hint: '11–12 digit, ada di meteran.' }],
    products: rows('pln', [20000, 50000, 100000, 200000, 500000, 1000000].map((n) => [`Token ${nominal(n)}`, n + 2500, n === 100000 ? 'Populer' : undefined])) },
  { id: 'listrik', kind: 'ppob', name: 'Tagihan Listrik Pascabayar', short: 'Tagihan Listrik', icon: 'fa-plug-circle-bolt', tone: 'purple', desc: 'Cek dan bayar tagihan listrik bulanan.', stepTitle: 'Data Pelanggan', inquiry: true, billLabel: 'Tagihan Listrik',
    fields: [{ id: 'custId', label: 'ID Pelanggan', ph: '123456789012', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 12, max: 12 }, hint: '12 digit ID pelanggan.' }] },
  { id: 'bpjs', kind: 'ppob', name: 'BPJS Kesehatan', short: 'BPJS', icon: 'fa-heart-pulse', tone: 'green', desc: 'Bayar iuran BPJS Kesehatan keluarga.', stepTitle: 'Data Peserta', inquiry: true, billLabel: 'Iuran BPJS',
    fields: [{ id: 'custId', label: 'Nomor Virtual Account', ph: '8888801234567890', inputmode: 'numeric', maxlength: 16, rule: { type: 'digits', min: 11, max: 16 }, hint: '11–16 digit nomor VA keluarga.' }] },
  { id: 'pdam', kind: 'ppob', name: 'PDAM', short: 'PDAM', icon: 'fa-droplet', tone: 'cyan', desc: 'Tagihan air PDAM dari berbagai wilayah.', stepTitle: 'Data Pelanggan', inquiry: true, billLabel: 'Tagihan Air',
    fields: [{ id: 'region', label: 'Wilayah PDAM', type: 'select', options: ['Jabodetabek', 'Jawa Barat', 'Jawa Tengah & DIY', 'Jawa Timur', 'Luar Jawa'] },
      { id: 'custId', label: 'Nomor Pelanggan', ph: '1234567', inputmode: 'numeric', maxlength: 12, rule: { type: 'digits', min: 6, max: 12 }, hint: '6–12 digit.' }] },
  { id: 'internet', kind: 'ppob', name: 'Internet & TV Kabel', short: 'Internet & TV', icon: 'fa-tv', tone: 'pink', desc: 'Tagihan internet rumah dan TV berlangganan.', stepTitle: 'Data Pelanggan', inquiry: true, billLabel: 'Tagihan Internet & TV',
    fields: [{ id: 'plan', label: 'Jenis Layanan', type: 'select', options: ['Internet Fiber Rumah', 'TV Kabel & Streaming', 'Paket Internet + TV'] },
      { id: 'custId', label: 'Nomor Pelanggan', ph: '12345678', inputmode: 'numeric', maxlength: 14, rule: { type: 'digits', min: 8, max: 14 }, hint: '8–14 digit.' }] },
  { id: 'ewallet', kind: 'ppob', name: 'Saldo E-Wallet', short: 'E-Wallet', icon: 'fa-wallet', tone: 'blue', desc: 'Top up DANA, OVO, GoPay, dan ShopeePay.', stepTitle: 'Data E-Wallet', layout: 'even',
    fields: [{ id: 'wallet', label: 'E-Wallet', type: 'select', options: ['DANA', 'OVO', 'GoPay', 'ShopeePay'] }, { ...FIELD_PHONE, label: 'Nomor Terdaftar', detect: false }],
    products: rows('ewallet', [10000, 20000, 50000, 100000, 200000, 500000].map((n) => [`Saldo ${nominal(n)}`, n + 1500, n === 100000 ? 'Populer' : undefined])) },
  { id: 'voucher', kind: 'ppob', name: 'Voucher Digital', short: 'Voucher Digital', icon: 'fa-ticket', tone: 'purple', desc: 'Voucher aplikasi, streaming, dan belanja.', stepTitle: 'Data Penerima', layout: 'even',
    fields: [{ id: 'brand', label: 'Jenis Voucher', type: 'select', options: ['Voucher Google Play', 'Voucher Spotify', 'Voucher Streaming Video'] }, { id: 'email', label: 'Email Penerima', ph: 'nama@email.com', type: 'email', inputmode: 'email', maxlength: 60, rule: { type: 'email' }, hint: 'Kode dikirim ke email ini.' }],
    products: rows('voucher', [20000, 50000, 100000, 150000, 300000].map((n) => [`Voucher ${nominal(n)}`, n + 2000, n === 50000 ? 'Populer' : undefined])) },
].map((s) => ({ subtitle: s.desc, ...s }));

const PAYMENTS = [
  { id: 'qris', name: 'QRIS', desc: 'Semua e-wallet & mobile banking', code: 'QR', color: '#14241d', fee: { type: 'percent', value: 0.7 } },
  { id: 'dana', name: 'DANA', desc: 'Bayar lewat aplikasi DANA', code: 'DANA', color: '#118eea', fee: { type: 'percent', value: 1 } },
  { id: 'ovo', name: 'OVO', desc: 'Bayar lewat aplikasi OVO', code: 'OVO', color: '#4c2a86', fee: { type: 'percent', value: 1.5 } },
  { id: 'gopay', name: 'GoPay', desc: 'Bayar lewat aplikasi Gojek', code: 'GP', color: '#00a05a', fee: { type: 'percent', value: 1 } },
  { id: 'shopeepay', name: 'ShopeePay', desc: 'Bayar lewat aplikasi Shopee', code: 'SP', color: '#e8472b', fee: { type: 'percent', value: 1.2 } },
  { id: 'va', name: 'Virtual Account', desc: 'Bank besar di Indonesia', code: 'VA', color: '#0e7a57', fee: { type: 'flat', value: 4000 } },
  { id: 'bank', name: 'Transfer Bank', desc: 'Transfer manual, verifikasi otomatis', code: 'TF', color: '#475569', fee: { type: 'flat', value: 2500 } },
];

/* Metode pembayaran yang tampil di checkout. Tambahkan id lain untuk menampilkan kembali. */
const ACTIVE_PAYMENT_IDS = ['qris'];
const activePayments = () => PAYMENTS.filter((p) => ACTIVE_PAYMENT_IDS.includes(p.id));

const PROMOS = [
  { code: 'HEMAT10', title: 'Diskon 10%', desc: 'Maks. Rp15.000 · min. belanja Rp30.000', type: 'percent', value: 10, max: 15000, min: 30000, scope: 'all' },
  { code: 'GAMER5K', title: 'Potongan Rp5.000', desc: 'Khusus top up game · min. belanja Rp25.000', type: 'flat', value: 5000, min: 25000, scope: 'game' },
  { code: 'PPOBHEMAT', title: 'Potongan Rp2.000', desc: 'Khusus layanan PPOB · min. belanja Rp20.000', type: 'flat', value: 2000, min: 20000, scope: 'ppob' },
  { code: 'NEWUSER', title: 'Diskon 15% Transaksi Pertama', desc: 'Maks. Rp25.000 · min. belanja Rp50.000', type: 'percent', value: 15, max: 25000, min: 50000, scope: 'all', firstOnly: true },
];

const PROMO_SLIDES = [
  { code: 'NEWUSER', icon: 'fa-gift', title: 'Diskon 15% Transaksi Pertama', text: 'Untuk pengguna baru. Maks. Rp25.000.' },
  { code: 'HEMAT10', icon: 'fa-percent', title: 'Hemat 10% Semua Produk', text: 'Berlaku untuk game & PPOB. Min. belanja Rp30.000.' },
  { code: 'PPOBHEMAT', icon: 'fa-bolt', title: 'Potongan Rp2.000 PPOB', text: 'Untuk pulsa, data, token, dan tagihan. Min. Rp20.000.' },
  { code: 'GAMER5K', icon: 'fa-gamepad', title: 'Potongan Rp5.000 Top Up Game', text: 'Khusus top up game favoritmu. Min. belanja Rp25.000.' },
];

const BEST = [
  ['ppob', 'pulsa', 'pulsa-6'], ['ppob', 'pln', 'pln-3'], ['ppob', 'ewallet', 'ewallet-4'], ['ppob', 'data', 'data-3'],
  ['game', 'mlbb', 'mlbb-5'], ['game', 'freefire', 'freefire-4'], ['game', 'pubgm', 'pubgm-3'], ['game', 'genshin', 'genshin-3'],
];
const DEALS = [
  ['ppob', 'data', 'data-3', 'PPOBHEMAT'], ['ppob', 'pln', 'pln-4', 'PPOBHEMAT'], ['ppob', 'ewallet', 'ewallet-5', 'HEMAT10'],
  ['game', 'mlbb', 'mlbb-9', 'HEMAT10'], ['game', 'genshin', 'genshin-7', 'HEMAT10'], ['game', 'codm', 'codm-4', 'GAMER5K'], ['game', 'steam', 'steam-4', 'HEMAT10'],
];

const QUICK = [['ppob', 'pulsa'], ['ppob', 'data'], ['ppob', 'pln'], ['ppob', 'ewallet'], ['ppob', 'voucher'], ['game', 'mlbb'], ['game', 'freefire'], ['game', 'pubgm'], ['game', 'genshin'], ['game', 'valorant']];

const FAQS = [
  ['Bagaimana cara top up game?', 'Pilih game, isi User ID (dan Zone/Server bila ada), pilih nominal, pasang kode promo bila punya, pilih metode pembayaran, lalu tekan “Lanjutkan Pembayaran”.'],
  ['Di mana saya menemukan User ID dan Zone ID?', 'Biasanya ada di halaman profil dalam game. Petunjuk singkat tampil di bawah setiap kolom input pada form top up.'],
  ['Bagaimana cara memakai kode promo?', 'Klik “Pakai Kode” pada banner promo, atau ketik kodenya di langkah Promo saat checkout. Syarat minimal belanja dan cakupan produk ditampilkan otomatis.'],
  ['Saya salah memasukkan ID, bisa dibatalkan?', 'Pesanan yang belum dibayar bisa dibatalkan dari halaman Transaksi. Pesanan yang sudah dibayar dan diproses tidak dapat diubah, jadi pastikan ID sudah benar sebelum membayar.'],
  ['Pembayaran sudah dilakukan tapi status masih menunggu?', 'Status diperbarui otomatis setelah pembayaran terkonfirmasi. Jika masih belum berubah, hubungi kami lewat halaman Kontak dengan menyertakan nomor invoice.'],
  ['Bagaimana cara mengecek status pesanan?', 'Buka halaman Transaksi lalu masukkan nomor invoice pesananmu.'],
];

const LEGAL = {
  terms: { title: 'Syarat & Ketentuan', icon: 'fa-file-contract', body: [
    ['Penggunaan layanan', 'Dengan menggunakan layanan ini, kamu menyatakan data yang dimasukkan (ID akun game, nomor tujuan, email) adalah benar. Kesalahan input dapat membuat pesanan tidak dapat dibatalkan setelah diproses.'],
    ['Harga & biaya', 'Harga produk, biaya admin, dan potongan promo ditampilkan sebelum pembayaran. Total yang harus dibayar adalah angka pada ringkasan transaksi.'],
    ['Pembayaran', 'Pesanan diproses setelah pembayaran terkonfirmasi. Pesanan yang tidak dibayar sebelum batas waktu akan dibatalkan otomatis.'],
    ['Pembatalan & pengembalian dana', 'Pesanan yang belum dibayar dapat dibatalkan kapan saja. Pesanan yang gagal diproses akan dikembalikan dananya sesuai kebijakan penyedia pembayaran.'],
    ['Promo', 'Setiap kode promo memiliki syarat minimal belanja, cakupan produk, dan batas potongan. Satu transaksi hanya dapat memakai satu kode.'],
  ] },
  privacy: { title: 'Kebijakan Privasi', icon: 'fa-user-shield', body: [
    ['Data yang kami proses', 'ID akun game atau nomor tujuan, email (bila diperlukan untuk pengiriman kode), serta nomor invoice, semata-mata untuk memproses dan menampilkan pesananmu.'],
    ['Penyimpanan di perangkat', 'Riwayat transaksi tidak disimpan di browser. Hanya preferensi tampilan (tema) yang disimpan di perangkatmu.'],
    ['Menghapus data', 'Kamu dapat menghapus preferensi tema dengan membersihkan data situs di browser. Data pesanan tidak tersimpan di perangkat.'],
  ] },
  contact: { title: 'Kontak', icon: 'fa-address-book', body: [
    ...(SITE.email ? [['Email', SITE.email]] : []),
    ...(SITE.whatsapp ? [['WhatsApp', SITE.whatsapp]] : []),
    ...(SITE.hours ? [['Jam layanan', SITE.hours]] : []),
    ['Saat menghubungi kami', 'Sertakan nomor invoice agar pesananmu lebih cepat kami periksa.'],
  ] },
};

const STATUS = {
  pending: { label: 'Menunggu Pembayaran', icon: 'fa-clock', desc: 'Selesaikan pembayaran agar pesanan dapat diproses.' },
  processing: { label: 'Diproses', icon: 'fa-gear', desc: 'Pembayaran diterima. Pesanan sedang diproses ke provider.' },
  success: { label: 'Berhasil', icon: 'fa-circle-check', desc: 'Pesanan selesai diproses.' },
  failed: { label: 'Gagal', icon: 'fa-circle-xmark', desc: 'Pesanan tidak dapat diselesaikan. Dana akan dikembalikan sesuai kebijakan.' },
  cancelled: { label: 'Dibatalkan', icon: 'fa-ban', desc: 'Pesanan dibatalkan dan tidak akan diproses.' },
};

const OPERATORS = [['Telkomsel', /^08(11|12|13|21|22|23|51|52|53)/], ['Indosat', /^08(14|15|16|55|56|57|58)/], ['XL', /^08(17|18|19|59|77|78)/], ['Axis', /^08(31|32|33|38)/], ['Tri', /^089[5-9]/], ['Smartfren', /^088[1-9]/]];

export {
  COVERS, SITE, CONFIG, GAMES, PPOB, PAYMENTS, activePayments, PROMOS, PROMO_SLIDES,
  BEST, DEALS, QUICK, FAQS, LEGAL, STATUS, OPERATORS,
};
